export const state={
  session:null,user:null,profile:null,coins:0,transactions:[],
  sound:true,music:true,currentGame:null,pendingGame:null
};
export const GAME_DEFS=[
 {id:"spades",title:"Cookie's Classic Spades",icon:"♠️",cost:0,desc:"Play tricks and race to the winning score."},
 {id:"solitaire",title:"Cookie Solitaire",icon:"♦️",cost:0,desc:"One-click card play with clear hints."},
 {id:"colorclash",title:"Cookie Color Clash",icon:"🎨",cost:0,desc:"Fast color and number card battles."},
 {id:"crush",title:"Cookie Crush Kingdom",icon:"🍪",cost:0,desc:"Match cookies, clear goals, and level up."},
 {id:"bingo",title:"Cookie Bingo Showdown",icon:"🎱",cost:0,desc:"Automatic caller, two cards, manual marking."},
 {id:"word",title:"Cookie Word Treasure",icon:"🔤",cost:0,desc:"Solve words and unlock harder rounds."},
 {id:"chess",title:"Cookie Quick Chess",icon:"♟️",cost:0,desc:"Quick turns with clear opposing colors."},
 {id:"dominoes",title:"Cookie Domino House",icon:"🁫",cost:0,desc:"Slower turns and clear move guidance."}
];
