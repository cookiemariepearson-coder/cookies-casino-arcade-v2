export const state={
  session:null,user:null,profile:null,coins:0,transactions:[],
  sound:true,music:true,currentGame:null,pendingGame:null
};
export const GAME_DEFS=[
 {id:"spades",title:"Cookie's Classic Spades",icon:"♠️",cost:75,desc:"Play tricks and race to the winning score."},
 {id:"solitaire",title:"Cookie Solitaire",icon:"♦️",cost:40,desc:"One-click card play with clear hints."},
 {id:"colorclash",title:"Cookie Color Clash",icon:"🎨",cost:60,desc:"Fast color and number card battles."},
 {id:"crush",title:"Cookie Crush Kingdom",icon:"🍪",cost:50,desc:"Match cookies, clear goals, and level up."},
 {id:"bingo",title:"Cookie Bingo Showdown",icon:"🎱",cost:45,desc:"Automatic caller, two cards, manual marking."},
 {id:"word",title:"Cookie Word Treasure",icon:"🔤",cost:35,desc:"Solve words and unlock harder rounds."},
 {id:"chess",title:"Cookie Quick Chess",icon:"♟️",cost:60,desc:"Quick turns with clear opposing colors."},
 {id:"dominoes",title:"Cookie Domino House",icon:"🁫",cost:50,desc:"Slower turns and clear move guidance."}
];
