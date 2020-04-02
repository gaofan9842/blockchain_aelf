
AElf = window.AElf;
const Wallet = AElf.wallet;
const sha256 = AElf.utils.sha256;

const defaultPrivateKey = '19cbe8e0d2f891d749e8183290d888db44b158e03adf16847f770edef1ef79c2';

const wallet = Wallet.getWalletByPrivateKey(defaultPrivateKey);
const aelf = new AElf(new AElf.providers.HttpProvider(
        'http://127.0.0.1:1235/chain',
        null,
        null,
        null,
        [{
            name: 'Accept',
            value: 'text/plain;v=1.0'
        }]
    ));
if(!aelf.isConnected()) {
    alert('Blockchain Node is not running.');
}

const helloWorldContractName = 'HelloWorldContract';
const {
    GenesisContractAddress
} = aelf.chain.getChainStatus();
const zeroC = aelf.chain.contractAt(GenesisContractAddress, wallet);
const helloWorldContractAddress = zeroC.GetContractAddressByName.call(sha256(helloWorldContractName));

const helloWorldC = aelf.chain.contractAt(helloWorldContractAddress, wallet);
const tokenAddress = zeroC.GetContractAddressByName.call(sha256('AElf.ContractNames.Token'));
const tokenContract = aelf.chain.contractAt(tokenAddress, wallet);
var db = openDatabase('DAPPDB', '1.0', 'TJU_DB', 2 * 1024 * 1024);