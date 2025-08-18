using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BackEnd.Models
{
    public class SendMessage
    {
        [Key, Column(Order = 0)]
        [ForeignKey(nameof(User))]
        public int UserId { get; set; }
        public User? User { get; set; }

        [Key, Column(Order = 1)]
        [ForeignKey(nameof(Chatbot))]
        public int MsgId { get; set; }
        public ChatBot? Chatbot { get; set; }
    }
}
