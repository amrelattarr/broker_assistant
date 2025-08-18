using System.ComponentModel.DataAnnotations;

namespace BackEnd.Models
{
    public class ChatBot
    {
        [Key]
        public int MsgId { get; set; }
        public string? MsgText { get; set; }
        public DateTime Timestamp { get; set; }

        //relationships
        public ICollection<SendMessage>? SendMessages { get; set; }
        public ICollection<Info>? Infos { get; set; }
    }

}
