"use client";
import React, { useContext } from 'react'
import  {Highlight } from 'prism-react-renderer';
import { Pre, Line, LineNo, LineContent } from "./styles";
import { DataContext } from '@/context/DataContext';

const CodePreviewer = () => {
  const {file} = useContext(DataContext)
    return (
      <>
        {file && <Highlight code={file} theme={reversedBlackAndWhiteTheme} language="jsx">
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <Pre className={className+"w-full"} style={style}>
            {tokens.map((line, i) => (
              <Line key={i} {...getLineProps({ line, key: i })}>
                <LineNo>{i + 1}</LineNo>
                <LineContent>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token, key })} />
                  ))}
                </LineContent>
              </Line>
            ))}
          </Pre>
        )}
      </Highlight>}
      </>
    )
}

const reversedBlackAndWhiteTheme = {
    plain: {
      color: '#fff', // White text
      backgroundColor: 'rgb(9 9 11)', // Black background
    },
    styles: [
      {
        types: ['comment'],
        style: {
          color: '#aaa', // Light gray for comments
        },
      },
      {
        types: ['keyword', 'variable'],
        style: {
          color: '#fff', // White for keywords and variables
        },
      },
      {
        types: ['string'],
        style: {
          color: '#fff', // White for strings
        },
      },
      {
        types: ['function'],
        style: {
          color: '#fff', // White for functions
        },
      },
      {
        types: ['operator'],
        style: {
          color: '#fff', // White for operators
        },
      },
      // Add more styles as needed
    ],
  };
  
  

export default CodePreviewer