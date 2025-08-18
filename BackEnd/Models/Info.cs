using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BackEnd.Models
{
    public class Info
    {
        [Key, Column(Order = 0)]
        [ForeignKey(nameof(Stock))]
        public int StockId { get; set; }
        public Stock? Stock { get; set; }

        [Key, Column(Order = 1)]
        [ForeignKey(nameof(Chatbot))]
        public int MsgId { get; set; }
        public ChatBot? Chatbot { get; set; }
    }
}
