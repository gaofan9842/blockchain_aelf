using AElf;
using AElf.Contracts.Genesis;
using AElf.Contracts.MultiToken.Messages;
using AElf.Sdk.CSharp.State;

// pb file
// option csharp_namespace = "HelloWorldContract";
// service HelloWorldContract
// {
//     option (aelf.csharp_state) = "HelloWorldContractState";

namespace MiddleManContract
{
    public partial class MiddleManContractState
    {
        internal TokenContractContainer.TokenContractReferenceState TokenContract { get; set; }
        internal BasicContractZeroContainer.BasicContractZeroReferenceState BasicContractZero { get; set; }
        public SingletonState<Hash> TokenContractSystemName { get; set; }
    }
}