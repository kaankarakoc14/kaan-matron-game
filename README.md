# MATRON

A web-based implementation of MATRON.

## How to Play

1. Player 1 chooses a number on the game board and receives that many points.
2. Player 2 automatically gets all the proper factors of that number (all factors except the number itself) and receives the sum of those factors as points.
3. Players then reverse roles. Player 2 chooses a number and gets points, then Player 1 gets all the proper factors and their points.
4. If a player chooses a number with no uncolored factors remaining, that player loses their turn and gets no points.
5. The game ends when there are no numbers remaining with uncolored factors.
6. The player with the higher score wins.

## Example

If Player 1 selects 12, they get 12 points. Player 2 then automatically gets the proper factors of 12 (1, 2, 3, 4, and 6) and receives 16 points (1+2+3+4+6).

## Running the Game

### Method 1: Directly in Browser
Simply open the `index.html` file in your browser to start playing.

### Method 2: Using Node.js Server
If you have Node.js installed, you can run the game using a local server:

1. Install Node.js if you haven't already (download from [nodejs.org](https://nodejs.org/))
2. Open a terminal/command prompt and navigate to the project directory
3. Run the following command to start the server:
   ```
   npm start
   ```
   or
   ```
   node server.js
   ```
4. Open your browser and go to `http://localhost:3000`

## Educational Value

This game helps students:
- Identify factors of numbers
- Develop strategies based on number relationships
- Practice mental arithmetic
- Learn about number properties

## Strategy Tips

1. Prime numbers (like 13, 17, 19) have only 1 as a proper factor, making them poor choices for the first player.
2. Numbers with many factors (like 12, 24, 30) generally favor the second player.
3. Consider the remaining numbers on the board when making your choice.

## Credits

Based on the game described by the National Council of Teachers of Mathematics (NCTM):
[NCTM Factor Game](https://www.nctm.org/Classroom-Resources/Illuminations/Interactives/Factor-Game/) 