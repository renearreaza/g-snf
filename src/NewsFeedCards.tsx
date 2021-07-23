import React from 'react';
import { ListItem } from 'microsoft-graph';

type Data = {
    [key: string]: any;
  };

interface NewsFeedCardsProps {
    listItems: ListItem[];
  }

