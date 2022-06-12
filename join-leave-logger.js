import { world } from 'mojang-minecraft';

world.events.playerJoin.subscribe(ev => {
  const { player } = ev;
  console.log(`Join >> ${player.name}`);
});

world.events.playerLeave.subscribe(ev => {
  const { playerName } = ev;
  console.log(`Leave >> ${playerName}`);
});
