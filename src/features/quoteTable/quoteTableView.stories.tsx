import React from 'react';
import { Story, Meta } from '@storybook/react';
import QuoteTableView, { QuoteTableViewProps } from './QuoteTableView';
import { getMockQuoteTicker } from './utils';

export default {
  title: 'features/QuoteTableView',
  component: QuoteTableView
} as Meta;

const data = [getMockQuoteTicker(), getMockQuoteTicker(), getMockQuoteTicker()];
const previousData = {
  [data[0].symbol]: { ...data[0], bid: '1000000', ask: '0.1' }
}

const Template: Story<QuoteTableViewProps> = args => <QuoteTableView { ...args } />;

export const DefaultUse = Template.bind({});

DefaultUse.args = {
  data,
  previousData
}

export const DarkThemeUse = Template.bind({});

DarkThemeUse.args = {
  data,
  previousData,
  themeDark: true,
}
