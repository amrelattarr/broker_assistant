using System.ComponentModel.DataAnnotations;

namespace BackEnd.Models
{
    public class Stock
    {
        [Key]
        public int StockId { get; set; }
        public string? EnglishName { get; set; }
        public decimal Value { get; set; }
        public string? Symbol { get; set; }
        public decimal Open { get; set; }
        public decimal Close { get; set; }
        public decimal Change { get; set; }

        //relationships
        public ICollection<Buy_Sell_Invest>? BuySellInvests { get; set; }
        public ICollection<Info>? Infos { get; set; }
    }
}
