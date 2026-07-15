# AI Debate Club
This application is an AI Debate Club platform where users can configure and watch structured, intellectual debates between different AI personas with distinct arguing styles and traits. Debates are conducted automatically across two rounds to ensure competitive fairness, with each debater getting an equal opportunity to argue both "For" (Affirmative) and "Against" (Negative) the chosen topic. Each round follows a precise, professional six-phase debate format consisting of Constructive speeches, Rebuttals, and Final Focus summaries from both sides. Upon completion of the turns, an independent AI Judge evaluates the transcript, awards scores based on argumentative depth and rhetorical skill, and provides detailed feedback. The scores and win/loss records are then aggregated to determine the overall match winner and update the interactive Leaderboard. (Debaters Model: gemini-3.1-flash-lite-preview, Judges Model: gemini-3.5-flash)

# Results
Each table contains the metrics for different personality personas of several debates between themselves. Each debate could end in a win (2-0), loss (0-2), or tie (1-1) along with a second out of 20 possible poitns for each debater.

Win% = Wins/(Wins+Loses) <br>
Swin% = Wins/(Wins+Ties+Loses)

Tiebreaking was done by the following:
1. Win%
2. Avg Pts
3. Wins
4. Coinflip

## Season 1
| Rank | Debater | Matches | Wins | Losses | Ties | Win % | Swin % | Avg Pts |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **1** | **Nyx** *(The Pragmatist)* | 18 | 10 | 3 | 5 | **76.9%** | **55.6%** | 17.5 |
| **2** | **Draco** *(The Skeptic)* | 18 | 9 | 4 | 5 | **69.2%** | **50.0%** | 16.5 |
| **3** | **Lyra** *(The Innovator)* | 18 | 8 | 5 | 5 | **61.5%** | **44.4%** | 16.2 |
| **4** | **Loki** *(The Liar)* | 16 | 7 | 5 | 4 | **58.3%** | **43.8%** | 15.8 |
| **5** | **Cassiopeia** *(The Baseline)* | 18 | 6 | 7 | 5 | **46.2%** | **33.3%** | 15.4 |
| **6** | **Orion** *(The Ethicist)* | 16 | 5 | 7 | 4 | **41.7%** | **31.3%** | 15.0 |
| **7** | **Helios** *(The Optimist)* | 16 | 4 | 8 | 4 | **33.3%** | **25.0%** | 14.5 |
| **8** | **Andromeda** *(The Visionary)* | 16 | 1 | 11 | 4 | **8.3%** | **6.3%** | 14.0 |

## Season 2
| Rank | Debater | Matches | Wins | Losses | Ties | Win % | Swin % | Avg Pts |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **1** | **Draco** *(The Skeptic)* | 23 | 16 | 3 | 4 | **84.2%** | **69.6%** | 16.7 |
| **2** | **Nyx** *(The Pragmatist)* | 31 | 14 | 6 | 11 | **70.0%** | **45.2%** | 16.9 |
| **3** | **Loki** *(The Liar)* | 20 | 9 | 9 | 2 | **50.0%** | **45.0%** | 15.5 |
| **4** | **Lyra** *(The Innovator)* | 26 | 10 | 7 | 9 | **58.8%** | **38.5%** | 15.8 |
| **5** | **Orion** *(The Ethicist)* | 21 | 8 | 10 | 3 | **44.4%** | **38.1%** | 15.2 |
| **6** | **Cassiopeia** *(The Baseline)* | 27 | 7 | 10 | 10 | **41.2%** | **25.9%** | 15.2 |
| **7** | **Andromeda** *(The Visionary)* | 22 | 6 | 11 | 5 | **35.3%** | **27.3%** | 14.6 |
| **8** | **Helios** *(The Optimist)* | 24 | 1 | 15 | 8 | **6.3%** | **4.2%** | 14.0 |

## Overall
| Rank | Debater | Matches | Wins | Losses | Ties | Win % | Swin % | Avg Pts |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **1** | **Draco** *(The Skeptic)* | 41 | 25 | 7 | 9 | **78.1%** | **61.0%** | 16.6 |
| **2** | **Nyx** *(The Pragmatist)* | 49 | 24 | 9 | 16 | **72.7%** | **49.0%** | 17.1 |
| **3** | **Lyra** *(The Innovator)* | 44 | 18 | 12 | 14 | **60.0%** | **40.9%** | 16.0 |
| **4** | **Loki** *(The Liar)* | 36 | 16 | 14 | 6 | 53.3% | 44.4% | 15.6 |
| **5** | **Cassiopeia** *(The Baseline)* | 45 | 13 | 17 | 15 | 43.3% | 28.9% | 15.3 |
| **6** | **Orion** *(The Ethicist)* | 37 | 13 | 17 | 7 | 43.3% | 35.1% | 15.1 |
| **7** | **Andromeda** *(The Visionary)* | 38 | 7 | 22 | 9 | 24.1% | 18.4% | 14.3 |
| **8** | **Helios** *(The Optimist)* | 40 | 5 | 23 | 12 | 17.9% | 12.5% | 14.2 |

Overall, several different personas outpreformed the baseline model (Cassiopeia), proving that short personality prompts can alter the effectivness of a personas ability to debate. Furthermore, its valuable to note that traits with evidence-driven personalities outpreformed ethics and omptimist personalities. 
