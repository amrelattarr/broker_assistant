import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BrokerService {
  private knowledgeBase: { keywords: string[], answer: string }[] = [
    {
      keywords: ['capital market broker', 'what is a capital market broker', 'broker definition', 'stock broker'],
      answer: 'A capital market broker is a licensed professional or firm that helps clients buy and sell securities such as stocks, bonds, and other investment products in capital markets.'
    },
    {
      keywords: ['capital market', 'what is capital market', 'define capital market'],
      answer: 'The capital market is a financial marketplace where buyers and sellers trade long-term securities like stocks and bonds, helping companies raise capital and investors earn returns.'
    },
    {
      keywords: ['primary market', 'what is primary market'],
      answer: 'The primary market is where new securities are issued and sold for the first time, such as in an Initial Public Offering (IPO).'
    },
    {
      keywords: ['secondary market', 'what is secondary market'],
      answer: 'The secondary market is where investors buy and sell securities that have already been issued, such as trading stocks on stock exchanges.'
    },
    {
      keywords: ['services', 'what do you offer', 'products', 'broker services'],
      answer: 'We offer stock and bond trading, portfolio management, investment advisory, IPO subscriptions, and market research.'
    },
    {
      keywords: ['research', 'market research', 'reports', 'analysis'],
      answer: 'Yes, we provide in-depth market research, daily updates, and investment insights to help you make informed decisions.'
    },
    {
      keywords: ['portfolio management', 'manage investments', 'investment management'],
      answer: 'We provide customized portfolio management services based on your investment goals and risk profile.'
    },
    {
      keywords: ['start trading', 'how to trade', 'begin trading', 'start investing'],
      answer: 'To start trading, open a brokerage account, deposit funds, and begin placing buy or sell orders through our platform.'
    },
    {
      keywords: ['open account', 'create account', 'register'],
      answer: 'To open an account, provide valid identification, proof of address, and complete our application process.'
    },
    {
      keywords: ['minimum deposit', 'lowest deposit', 'starting amount'],
      answer: 'Our minimum deposit requirement varies depending on the account type. Please contact support for details.'
    },
    {
      keywords: ['buy shares', 'purchase shares', 'invest in stocks'],
      answer: 'You can buy shares by placing a buy order through our trading platform after funding your account.'
    },
    {
      keywords: ['sell shares', 'liquidate shares', 'sell stocks'],
      answer: 'You can sell shares by placing a sell order on our trading platform. The proceeds will be credited to your account.'
    },
    {
      keywords: ['fees', 'commission', 'charges'],
      answer: 'Our fees depend on the type of transaction. We charge a small commission per trade and may have account maintenance fees.'
    },
    {
      keywords: ['how do brokers make money', 'broker earnings'],
      answer: 'Brokers earn through commissions, spreads, or service fees on trades and investments.'
    },
    {
      keywords: ['investing tips', 'how to invest', 'investment advice'],
      answer: 'Start by defining your goals, assessing your risk tolerance, and diversifying your investments.'
    },
    {
      keywords: ['long term', 'short term', 'investment strategy'],
      answer: 'Long-term investing focuses on gradual wealth growth over years, while short-term investing seeks quicker returns but carries more risk.'
    },
    {
      keywords: ['diversification', 'spread investments', 'reduce risk'],
      answer: 'Diversification means spreading investments across different assets to reduce risk.'
    },
    {
      keywords: ['ipo', 'initial public offering', 'new listing'],
      answer: 'An IPO (Initial Public Offering) is when a private company offers its shares to the public for the first time.'
    },
    {
      keywords: ['bonds', 'government bonds', 'corporate bonds'],
      answer: 'Bonds are debt instruments issued by governments or companies to raise money, offering fixed interest payments to investors.'
    },
    {
      keywords: ['stocks', 'shares', 'equity'],
      answer: 'Stocks represent ownership in a company and a claim on part of its profits.'
    },
    {
      keywords: ['trading volume', 'volume of trades'],
      answer: 'Trading volume is the total number of shares or contracts traded during a given period.'
    },
    {
      keywords: ['market volatility', 'price fluctuation', 'volatile market'],
      answer: 'Market volatility measures how much asset prices fluctuate over a period of time.'
    },
    {
      keywords: ['risk', 'investing risk', 'is investing risky'],
      answer: 'Yes, all investments carry some risk. Diversifying your portfolio can help manage it.'
    },
    {
      keywords: ['reduce risk', 'risk management'],
      answer: 'Reduce risk by diversifying, investing for the long term, and avoiding emotional decisions.'
    }
  ];

  getAnswer(question: string): string {
    const lowerQ = question.toLowerCase();
    for (const entry of this.knowledgeBase) {
      for (const keyword of entry.keywords) {
        if (lowerQ.includes(keyword)) {
          return entry.answer;
        }
      }
    }
    return " Could you please rephrase your question about capital markets or brokers?";
  }
}