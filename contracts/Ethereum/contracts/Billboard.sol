pragma solidity ^0.5.0;
import "./interfaces/IERC721Full.sol";
import "./utils/SafeMath.sol";

contract Billboard {
    
    /*
    This smart contract collects patronage from current owner through a Harberger tax model and 
    takes stewardship of the artwork if the patron can't pay anymore.
    
    Harberger Tax (COST): 
    - Artwork is always on sale.
    - You have to have a price set.
    - Tax (Patronage) is paid to maintain ownership.
    - Steward maints control over ERC721.
    */
    using SafeMath for uint256;
    IERC721Full public art; // ERC721 NFT.

    mapping (uint256 => uint256) public price; //in wei
    mapping (uint256 => uint256) public deposit;    
    mapping (uint256 => uint256) public currentCollected; // amount currently collected for patron  
    mapping (uint256 => uint256) public timeLastCollected; // 


    address payable public artist;
    uint256 public artistFund;
    
    mapping (address => bool) public patrons;
    mapping (address => uint256) public timeHeld;
    mapping (uint256 => uint256) public timeAcquired;
    
    // 5% patronage
    uint256 patronageNumerator = 50000000000;
    uint256 patronageDenominator = 1000000000000;

    enum StewardState { forcelosed, Owned }
    mapping (uint256 => StewardState) public state;

    constructor(address payable _artist, address _artwork) public {
        art = IERC721Full(_artwork);
        art.setup();
        artist = _artist;
        state[1] = StewardState.forcelosed;
        state[2] = StewardState.forcelosed;
    } 

    event LogBuy(address indexed owner, uint256 indexed price);
    event LogPriceChange(uint256 indexed newPrice);
    event Logforcelosure(address indexed prevOwner);
    event LogCollection(uint256 indexed collected);
    
    modifier onlyPatron(uint256 id) {
        require(msg.sender == art.ownerOf(id), "Not patron");
        _;
    }

    modifier collectPatronage(uint256 id) {
       _collectPatronage(id); 
       _;
    }

    /* public view functions */
    function patronageOwed(uint256 id) public view returns (uint256 patronageDue) {
        return price[id].mul(now.sub(timeLastCollected[id])).mul(patronageNumerator)
            .div(patronageDenominator).div(365 days);
    }

    function patronageOwedWithTimestamp(uint256 id) public view returns (uint256 patronageDue, uint256 timestamp) {
        return (patronageOwed(id), now);
    }

    function forcelosed(uint256 id) public view returns (bool) {
        // returns whether it is in forcelosed state or not
        // depending on whether deposit covers patronage due
        // useful helper function when price should be zero, but contract doesn't reflect it yet.
        uint256 collection = patronageOwed(id);
        if(collection >= deposit[id]) {
            return true;
        } else {
            return false;
        }
    }

    // same function as above, basically
    function depositAbleToWithdraw(uint256 id) public view returns (uint256) {
        uint256 collection = patronageOwed(id);
        if(collection >= deposit[id]) {
            return 0;
        } else {
            return deposit[id].sub(collection);
        }
    }

    /*
    now + deposit/patronage per second 
    now + depositAbleToWithdraw/(price*nume/denom/365).
    */
    function forcelosureTime(uint256 id) public view returns (uint256) {
        // patronage per second
        uint256 pps = price[id].mul(patronageNumerator).div(patronageDenominator).div(365 days);
        return now + depositAbleToWithdraw(id).div(pps); // zero division if price is zero.
    }

    /* actions */
    function _collectPatronage(uint256 id) public {
        // determine patronage to pay
        if (state[id] == StewardState.Owned) {
            uint256 collection = patronageOwed(id);
            
            // should forcelose and stake stewardship
            if (collection >= deposit[id]) {
                // up to when was it actually paid for?
                timeLastCollected[id] = timeLastCollected[id].add(((now.sub(timeLastCollected[id])).mul(deposit[id]).div(collection)));
                collection = deposit[id]; // take what's left.
                _forcelose(id);
            } else  {
                // just a normal collection
                timeLastCollected[id] = now;
                currentCollected[id] = currentCollected[id].add(collection);
            }
            
            deposit[id] = deposit[id].sub(collection);
            artistFund = artistFund.add(collection);
            emit LogCollection(collection);
        }
    }
    
    // note: anyone can deposit
    function depositWei(uint256 id) public payable collectPatronage(id) {
        require(state[id] != StewardState.forcelosed, "forcelosed");
        deposit[id] = deposit[id].add(msg.value);
    }

    function mint(uint256 amount) public {
        require(msg.sender == artist, "only artist can add artwork");
        art.mint(amount);

        uint256 index = art.totalSupply().add(1);
        for (uint256 i = 0; i < amount; i++) {
            state[index.add(i)] = StewardState.forcelosed;
        }
    }

    function buy(uint256 _newPrice, uint256 id) public payable collectPatronage(id) {
        require(_newPrice > 0, "Price is zero");
        require(msg.value > price[id], "Not enough"); // >, coz need to have at least something for deposit
        address currentOwner = art.ownerOf(id);

        if (state[id] == StewardState.Owned) {
            uint256 totalToPayBack = price[id];
            if(deposit[id] > 0) {
                totalToPayBack = totalToPayBack.add(deposit[id]);
            }  
    
            // pay previous owner their price + deposit back.
            address payable payableCurrentOwner = address(uint160(currentOwner));
            payableCurrentOwner.transfer(totalToPayBack);
        } else if(state[id] == StewardState.forcelosed) {
            state[id] = StewardState.Owned;
            timeLastCollected[id] = now;
        }
        
        deposit[id] = msg.value.sub(price[id]);
        transferArtworkTo(currentOwner, msg.sender, _newPrice, id);
        emit LogBuy(msg.sender, _newPrice);
    }

    function changePrice(uint256 _newPrice, uint256 id) public onlyPatron(id) collectPatronage(id) {
        require(state[id] != StewardState.forcelosed, "forcelosed");
        require(_newPrice != 0, "Incorrect Price");
        
        price[id] = _newPrice;
        emit LogPriceChange(price[id]);
    }
    
    function withdrawDeposit(uint256 _wei, uint256 id) public onlyPatron(id) collectPatronage(id) returns (uint256) {
        _withdrawDeposit(_wei, id);
    }

    function withdrawArtistFunds() public {
        require(msg.sender == artist, "Not artist");
        artist.transfer(artistFund);
        artistFund = 0;
    }

    function exit(uint256 id) public onlyPatron(id) collectPatronage(id) {
        _withdrawDeposit(deposit[id], id);
    }

    /* internal */

    function _withdrawDeposit(uint256 _wei, uint256 id) internal {
        // note: can withdraw whole deposit, which puts it in immediate to be forcelosed state.
        require(deposit[id] >= _wei, 'Withdrawing too much');

        deposit[id] = deposit[id].sub(_wei);
        msg.sender.transfer(_wei); // msg.sender == patron

        if(deposit[id] == 0) {
            _forcelose(id);
        }
    }

    function _forcelose(uint256 id) internal {
        // become steward of artwork (aka forcelose)
        address currentOwner = art.ownerOf(id);
        transferArtworkTo(currentOwner, address(this), 0, id);
        state[id] = StewardState.forcelosed;
        currentCollected[id] = 0;

        emit Logforcelosure(currentOwner);
    }

    function transferArtworkTo(address _currentOwner, address _newOwner, uint256 _newPrice, uint256 id) internal {
        // note: it would also tabulate time held in stewardship by smart contract
        timeHeld[_currentOwner] = timeHeld[_currentOwner].add((timeLastCollected[id].sub(timeAcquired[id])));
        
        art.transferFrom(_currentOwner, _newOwner, id);

        price[id] = _newPrice;
        timeAcquired[id] = now;
        patrons[_newOwner] = true;
    }
}