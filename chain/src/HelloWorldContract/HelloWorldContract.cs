using System.Text;
using AElf;
using Google.Protobuf.WellKnownTypes;

namespace HelloWorldContract
{
    public partial class HelloWorldContract : HelloWorldContractContainer.HelloWorldContractBase
    {
        
        private const int like_score_sender=2;
        private const int like_score_receiver=2;
        private const int dislike_score_sender=2;
        private const int dislike_score_receiver=2;
        private const int comment_score_sender=2;
        private const string score_authority_positive="TJUAP";
        private const string score_authority_negative="TJUAN";
        private const string score_participate_positive="TJUPP";
        private const string score_participate_negative="TJUPN";
        public override Empty InitializeHelloContract(InitializeHelloContractInput input){
            Assert(!State.Initialized.Value, "Already initialized.");
            State.BasicContractZero.Value = Context.GetZeroSmartContractAddress();
            State.TokenContract.Value = 
                State.BasicContractZero.GetContractAddressByName.Call(input.TokenContractSystemName);
            State.Initialized.Value = true;
            return new Empty();
        }
        public override Empty likeEvent (TwoSidesAddress input) {

            //send postive score to like sender
            State.TokenContract.Transfer.Send(new AElf.Contracts.MultiToken.Messages.TransferInput{
                To = Address.FromBytes(ByteArrayHelpers.FromHexString(input.SenderAdd)), 
                Symbol = score_participate_positive,
                Amount = like_score_sender, 
                Memo = "like_score to sender"
            });

            //send postive score to like receiver 
            State.TokenContract.Transfer.Send(new AElf.Contracts.MultiToken.Messages.TransferInput{
                To = Address.FromBytes(ByteArrayHelpers.FromHexString(input.ReceiverAdd)), 
                Symbol = score_authority_positive,
                Amount = like_score_receiver, 
                Memo = "like_score to receiver"
            });

            return new Empty();
        }

        public override Empty dislikeEvent (TwoSidesAddress input){

             //send postive score to dislike sender
            State.TokenContract.Transfer.Send(new AElf.Contracts.MultiToken.Messages.TransferInput{
                To = Address.FromBytes(ByteArrayHelpers.FromHexString(input.SenderAdd)), 
                Symbol = score_participate_positive,
                Amount = dislike_score_sender, 
                Memo = "dislike_score to sender"
            });

            //send postive score to dislike receiver 
            State.TokenContract.Transfer.Send(new AElf.Contracts.MultiToken.Messages.TransferInput{
                To = Address.FromBytes(ByteArrayHelpers.FromHexString(input.ReceiverAdd)), 
                Symbol = score_authority_negative,
                Amount = dislike_score_receiver, 
                Memo = "dislike_score to receiver"
            });

            return new Empty();
        } 

        public override Empty commentEvent (CommentEventAddress input){

            //send postive score to comment sender
            State.TokenContract.Transfer.Send(new AElf.Contracts.MultiToken.Messages.TransferInput{
                To = Address.FromBytes(ByteArrayHelpers.FromHexString(input.SenderCommentAdd)), 
                Symbol = score_participate_positive,
                Amount = comment_score_sender, 
                Memo = input.CommentContent
            });


            return new Empty();
        }
         public override Empty middleTransfer (MiddleTransInfo input){

            //send postive score to comment sender
            State.TokenContract.Transfer.Send(new AElf.Contracts.MultiToken.Messages.TransferInput{
                To = Address.FromBytes(ByteArrayHelpers.FromHexString(input.To)), 
                Symbol = input.MySymbol,
                Amount = input.Amount, 
                Memo = "记事本"
            });


            return new Empty();
        }



        


    }
}