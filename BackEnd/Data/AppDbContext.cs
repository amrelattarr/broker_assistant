using BackEnd.Models;
using Microsoft.EntityFrameworkCore;

namespace BackEnd.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
      : base(options)
        {
        }
        public DbSet<User> Users { get; set; }
        public DbSet<Stock> Stocks { get; set; }
        public DbSet<ChatBot> Chatbots { get; set; }
        public DbSet<Egx30> Egx30s { get; set; }

        public DbSet<Buy_Sell_Invest> BuySellInvests { get; set; }
        public DbSet<SendMessage> SendMessages { get; set; }
        public DbSet<Info> Infos { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Egx30>()
                .Property(e => e.Time)
                .HasColumnType("time");

            // BuySellInvest composite key
            modelBuilder.Entity<Buy_Sell_Invest>()
                .HasKey(b => new { b.UserId, b.StockId });

            modelBuilder.Entity<Buy_Sell_Invest>()
                .HasOne(b => b.User)
                .WithMany(u => u.BuySellInvests)
                .HasForeignKey(b => b.UserId);

            modelBuilder.Entity<Buy_Sell_Invest>()
                .HasOne(b => b.Stock)
                .WithMany(s => s.BuySellInvests)
                .HasForeignKey(b => b.StockId);

            // SendMessage composite key
            modelBuilder.Entity<SendMessage>()
                .HasKey(sm => new { sm.UserId, sm.MsgId });

            modelBuilder.Entity<SendMessage>()
                .HasOne(sm => sm.User)
                .WithMany(u => u.SendMessages)
                .HasForeignKey(sm => sm.UserId);

            modelBuilder.Entity<SendMessage>()
                .HasOne(sm => sm.Chatbot)
                .WithMany(c => c.SendMessages)
                .HasForeignKey(sm => sm.MsgId);

            // Info composite key
            modelBuilder.Entity<Info>()
                .HasKey(i => new { i.StockId, i.MsgId });

            modelBuilder.Entity<Info>()
                .HasOne(i => i.Stock)
                .WithMany(s => s.Infos)
                .HasForeignKey(i => i.StockId);

            modelBuilder.Entity<Info>()
                .HasOne(i => i.Chatbot)
                .WithMany(c => c.Infos)
                .HasForeignKey(i => i.MsgId);
        }

    }
}
