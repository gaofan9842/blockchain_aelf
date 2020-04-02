using AElf.Sdk.CSharp.State;

namespace MiddleManContract
{
    public partial class MiddleManContractState : ContractState
    {
        public SingletonState<bool> Initialized { get; set; }
      //  public SingletonState<CommentEventAddress> commentState { get; set; }
    }
}