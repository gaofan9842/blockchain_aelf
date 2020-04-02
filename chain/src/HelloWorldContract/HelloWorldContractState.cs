using AElf.Sdk.CSharp.State;

namespace HelloWorldContract
{
    public partial class HelloWorldContractState : ContractState
    {
        public SingletonState<bool> Initialized { get; set; }
        public SingletonState<CommentEventAddress> commentState { get; set; }
        public SingletonState<TwoSidesAddress> twosidesState { get; set; }
        public SingletonState<MiddleTransInfo> middletransinfoState { get; set; }
        
    }
}