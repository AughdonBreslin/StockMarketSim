# MyMarketSim
CS546 Final Project
## Members:

Ella Crabtree, Aughdon Breslin, Christian Bautista, Ankit Patel


## Project Name: MyMarketSim


## Brief Description:

We plan to create a website that simulates trading stocks. We will fetch data from stocks in the market and allow users to simulate purchasing and selling based on their account balances.  The user will log in to their account, see an account overview, and then have the ability to trade stocks, and check various graphics on their portfolios, histories of their current holdings, and other statistics (most importantly total profit/loss).

The purpose of this project is to simulate pulling from real-time datasets and to allow consumers to practice using the stock market for educational or recreational purposes. People would gain experience trading stocks without having to put actual money into it.


## GitHub URL: [https://github.com/AughdonBreslin/StockMarketSim](https://github.com/AughdonBreslin/StockMarketSim)


## Core features: 



* Frontpage displays daily/weekly updates on your portfolio performance (eg: Hey ___, your portfolio increased by 1% today')
* Graphs
    * Show the overall portfolio value over time
    * Show individual stock values over time
* Deposit system that allows users to either create an initial balance upon account creation or from within a deposit/withdrawal mechanic 
* Add support for automatic trading. 
    * e.g.: The user would be able to place an order to purchase X shares of ABC stock at price Y. Then, if ABC's share price falls to $Y, X shares of ABC are automatically purchased. The user would be able to set automatic buy options for multiple stocks and would be able to have multiple automated purchase options for a single stock (eg: buy 10 shares of ABS when its share price is $150, and buy 20 shares when its share price is $130). The user would be able to rank the priority of each automatic purchase. This way, the program would know which stocks to purchase in the event there are insufficient funds to execute all automated purchase orders.
* The user would also have flexibility when their account has insufficient funds to execute an automated purchase order. Specifically, the user would have the option to buy as many shares as they can afford or not buy any shares at all.
* This program would also support automated selling. This is similar to the automated buying feature. Eg: The user would have the option to automatically sell certain stocks once the stock reaches a certain price.
* Have a transaction log of all user activity. The log would show every time the user buys or sells a stock, date/time and price information, and various other actions.


## Extra features: 



* The user would have the option to set a minimum account balance. Eg: If the minimum balance is $5000, then the user would be either warned against or prevented from purchasing stocks (or placing automated purchase orders) if the transaction would result in their account balance falling below the minimum amount. 
* Add support for a group simulation. Users would be able to create a server that would host several people, public or private. Based on some settings, there could be an active leaderboard of the individuals’ portfolios. This simulation would run for a set period of time, and the winner would be the user with the best portfolio at the end.
* Newsfeed section that shows users the latest business/economics news articles from mainstream news sources
* Add support for cryptocurrency
