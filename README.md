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

Overall, 4 different personas outpreformed the baseline model (Cassiopeia), proving that short personality prompts can alter the effectivness of a personas ability to debate. Furthermore, traits with evidence-driven personalities outpreformed ethics and omptimist personalities. 
