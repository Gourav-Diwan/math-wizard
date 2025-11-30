import { Skull, Heart, Clock, Trophy } from 'lucide-react';

export const builtInTemplates = [
  {
    type: 'kills-deaths',
    icon: Skull,
    color: 'purple',
    title: 'Kill/Death Ratio',
    generateLevel: () => {
      const total = 80 + Math.floor(Math.random() * 41);
      const diff = 10 + Math.floor(Math.random() * 31);
      const x = (total + diff) / 2;
      const y = (total - diff) / 2;
      return {
        story: `A player finished ${total} total rounds (kills + deaths). They had ${diff} more kills than deaths.`,
        eq1: `x + y = ${total}`,
        eq2: `x - y = ${diff}`,
        eq1Text: 'Total rounds',
        eq2Text: 'Kill advantage',
        xLabel: 'Kills',
        yLabel: 'Deaths',
        solution: { x, y },
        total,
        diff
      };
    }
  },
  {
    type: 'health-shield',
    icon: Heart,
    color: 'green',
    title: 'Health + Shield Combo',
    generateLevel: () => {
      const total = 150 + Math.floor(Math.random() * 51);
      const healthMore = 20 + Math.floor(Math.random() * 31);
      const x = (total + healthMore) / 2;
      const y = (total - healthMore) / 2;
      return {
        story: `Your character has ${total} total protection points (health + shield). Health is ${healthMore} points higher than shield.`,
        eq1: `x + y = ${total}`,
        eq2: `x - y = ${healthMore}`,
        eq1Text: 'Total protection',
        eq2Text: 'Health advantage',
        xLabel: 'Health',
        yLabel: 'Shield',
        solution: { x, y },
        total,
        diff: healthMore
      };
    }
  },
  {
    type: 'time-challenge',
    icon: Clock,
    color: 'blue',
    title: 'Speed Run Timer',
    generateLevel: () => {
      const totalTime = 100 + Math.floor(Math.random() * 101);
      const timeDiff = 20 + Math.floor(Math.random() * 41);
      const x = (totalTime + timeDiff) / 2;
      const y = (totalTime - timeDiff) / 2;
      return {
        story: `Two speed runners completed levels in ${totalTime} seconds combined. The faster runner beat the slower one by ${timeDiff} seconds.`,
        eq1: `x + y = ${totalTime}`,
        eq2: `x - y = ${timeDiff}`,
        eq1Text: 'Combined time',
        eq2Text: 'Time difference',
        xLabel: 'Slower Time (sec)',
        yLabel: 'Faster Time (sec)',
        solution: { x, y },
        total: totalTime,
        diff: timeDiff
      };
    }
  },
  {
    type: 'sports',
    icon: Trophy,
    color: 'orange',
    title: 'Sports Stats',
    generateLevel: () => {
      const totalShots = 60 + Math.floor(Math.random() * 41);
      const moreMakes = 10 + Math.floor(Math.random() * 21);
      const x = (totalShots + moreMakes) / 2;
      const y = (totalShots - moreMakes) / 2;
      return {
        story: `A player took ${totalShots} total shots. They made ${moreMakes} more shots than they missed.`,
        eq1: `x + y = ${totalShots}`,
        eq2: `x - y = ${moreMakes}`,
        eq1Text: 'Total shots',
        eq2Text: 'Made advantage',
        xLabel: 'Shots Made',
        yLabel: 'Shots Missed',
        solution: { x, y },
        total: totalShots,
        diff: moreMakes
      };
    }
  }
];

export const creatorTemplates = [
  { 
    id: 'kills-deaths', 
    icon: Skull, 
    name: 'Game Stats',
    color: 'purple',
    examples: { 
      xLabel: 'Kills', 
      yLabel: 'Deaths', 
      story: 'A player finished 100 rounds with 20 more kills than deaths.',
      title: 'Epic Battle Stats'
    }
  },
  { 
    id: 'health-shield', 
    icon: Heart, 
    name: 'Health & Shields',
    color: 'green',
    examples: { 
      xLabel: 'Health', 
      yLabel: 'Shield', 
      story: 'Your character has 100 protection points with health 20 higher than shield.',
      title: 'Shield Challenge'
    }
  },
  { 
    id: 'sports', 
    icon: Trophy, 
    name: 'Sports Stats',
    color: 'orange',
    examples: { 
      xLabel: 'Shots Made', 
      yLabel: 'Shots Missed', 
      story: 'You took 100 total shots with 20 more makes than misses.',
      title: 'Basketball Challenge'
    }
  },
  { 
    id: 'time-challenge', 
    icon: Clock, 
    name: 'Time Challenge',
    color: 'blue',
    examples: { 
      xLabel: 'Fast Time', 
      yLabel: 'Slow Time', 
      story: 'Two players finished in 100 seconds combined with a 20 second difference.',
      title: 'Speed Run'
    }
  }
];
