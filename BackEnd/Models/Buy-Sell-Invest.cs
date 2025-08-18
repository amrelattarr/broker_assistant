using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BackEnd.Models
{
    public class Buy_Sell_Invest
    {
        [Key, Column(Order = 0)]
        [ForeignKey(nameof(User))]
        public int UserId { get; set; }
        public User? User { get; set; }

        [Key, Column(Order = 1)]
        [ForeignKey(nameof(Stock))]
        public int StockId { get; set; }
        public Stock? Stock { get; set; }
        public int buyPrice { get; set; }
        public int sellPrice { get; set; }
        public int changeAmount { get; set; }
    }
}
