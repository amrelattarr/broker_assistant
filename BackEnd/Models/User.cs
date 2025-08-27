using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackEnd.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        public string? Username { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }

        public int? Balance { get; set; }

        //relationships
        public ICollection<Buy_Sell_Invest>? BuySellInvests { get; set; }
        public ICollection<SendMessage>? SendMessages { get; set; }
    }
}
