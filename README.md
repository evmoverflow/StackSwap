# StackSwap

_StackSwap is a **highly** optimized contract for ethereum stablecoins swap._

## Address

StackSwap: [0xeeeeaeCCCEEEacEEcEEA7719Ece73B779a121f6C](https://etherscan.io/address/0xeeeeaeccceeeaceeceea7719ece73b779a121f6c)

## Swap

| id | name | function | returns | gas cost | description |
| --- | --- | --- | --- | --- | --- |
| 0 | swapT2C | swapT2C_10357(uint256 amountIn) | - | 80,063 | Swaps from USDT to USDC |
| 1 | swapC2T | swapC2T_01800(uint256 amountIn) | - | 84,015 | Swaps from USDC to USDT |
| 2 | swapD2B | swapD2B_00599(uint256 amountIn) | - | 69,667 | Swaps from DAI to BUSD |
| 3 | swapB2D | swapB2D_02258(uint256 amountIn) | - | 73,223 | Swaps from BUSD to DAI |
| 4 | swapT2B | swapT2B_14208(uint256 amountIn) | - | 80,739 | Swaps from USDT to BUSD |
| 5 | swapC2B | swapC2B_00745(uint256 amountIn) | - | 87,101 | Swaps from USDC to BUSD |
| 6 | swapT2D | swapT2D_00978(uint256 amountIn) | - | 66,293 | Swaps from USDT to DAI |
| 7 | swapC2D | swapC2D_12243(uint256 amountIn) | - | 72,655 | Swaps from USDC to DAI |
| 8 | swapD2C | swapD2C_01083(uint256 amountIn) | - | 69,013 | Swaps from DAI to USDC |
| 9 | swapB2C | swapB2C_04080(uint256 amountIn) | - | 87,015 | Swaps from BUSD to USDC |
| 10 | swapD2T | swapD2T_01512(uint256 amountIn) | - | 83,697 | Swaps from DAI to USDT |
| 11 | swapB2T | swapB2T_02283(uint256 amountIn) | - | 101,699 | Swaps from BUSD to USDT |

## Utils

| name | function | returns | description |
| --- | --- | --- | --- |
| getFee | getFee_00201(uint256 id) | uint256 fee | Get current fee for asked swap id |
| getReturn | getReturn_00958(uint256 id, uint256 amountIn) | uint256 amountOut | Get expected return amount for asked swap id |

## License
See license at [LICENSE](../blob/master/LICENSE)
