using System.Text;
using AElf;
using Google.Protobuf.WellKnownTypes;

namespace MiddleManContract
{
    public partial class MiddleManContract : MiddleManContractContainer.MiddleManContractBase
    {

        


/*         public  HelloReturn Hello(Empty input)
        {
             State.TokenContract.GetBalance.Call(new AElf.Contracts.MultiToken.Messages.GetBalanceInput{
                Owner = Context.Self,
                Symbol = Context.Variables.NativeSymbol
            }); 
            State.TokenContract.Transfer.Send(new AElf.Contracts.MultiToken.Messages.TransferInput{
                To = Address.FromBytes(ByteArrayHelpers.FromHexString("e0b40ddc3520d0b5363bd9775014d77e4b8fe832946d0e3825731d89127b813a")), // 不能给自己转
                Symbol = "BTC",
                Amount = 1, // 必须大于0
                Memo = "Test"
            });
            object sender = State.TokenContract.GetBalance.Call(new AElf.Contracts.MultiToken.Messages.GetBalanceInput{
                Owner = Context.Self,
                Symbol = "BTC"
            });
            object receiever = State.TokenContract.GetBalance.Call(new AElf.Contracts.MultiToken.Messages.GetBalanceInput{
                Owner = "2hxkDg6Pd2d4yU1A16PTZVMMrEDYEPR8oQojMDwWdax5LsBaxX",
                Symbol = "BTC"
            });
            solveString(sender); 
            return new HelloReturn {Value = hh[2]};
        } */
  /*       public string senderString(object sender){
            string  ans="";
            string [] hh=new string [3];
            hh = ob1.ToString().Split(',');
            for (int i=0;i<hh[2].Length;i++){
                if (hh[2][i]>='0' || hh[2][i]<='9'){
                    ans+=hh[2][i];
                }
            }
            return ans;
        } */
    }
}