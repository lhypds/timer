
timer
=====


<img width="329" height="301" alt="image" src="https://github.com/user-attachments/assets/b171252c-12a5-4ec0-99f4-ca63cc93f520" />

Timer program.  
Click the time, use numeric keys and `Backspace` key to edit the time, and then press `▶︎` or `Enter` key to start the timer.  
Support touch screen.  

Modes:  
1. Countdown timer mode
   Edit time by clicking on it.
2. Count to timer mode
    Click the time to edit and then click the left rectangle to enable the Count to timer mode. Input a time it will calculate the remaining time and start counting down.
3. Stopwatch mode

Setup  
`pnpm install`

Run  
`pnpm run dev`

Shortcuts  
Use `Enter` key to start/stop the timer.  


Even glasses integration
------------------------

The sibling `../timer-even` app embeds this website and mirrors its timer as one small text line on Even glasses. Deploy this project's updated `dist/` to timer.gcc3.com before using the companion package. Keep the site embeddable by the Even host.

`useTimerClock` anchors countdown and stopwatch time to wall time, including after a suspended tab resumes. `useEvenTimerSync` publishes timestamped state only when embedded with `evenSession` and `evenParentOrigin` and after a matching request from its parent. Normal standalone visits do not publish state. Countdown, stopwatch, edits, start/pause, reset, and count-to-time editing are included; no backend or account is needed.

For a local end-to-end check, run this project's dev server on port 3300 and run `VITE_TIMER_URL=http://localhost:3300/ npm run dev` in `../timer-even`. Protocol and clock tests live in `../timer-even` (`npm test`).
