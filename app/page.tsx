'use client';

import React, { useState } from 'react';
// import Filter from 'bad-words';
import MintFilter from 'mint-filter';
import Image from 'next/image';

export default function Home() {
  const [inputText, setInputText] = useState('');
  const [forbiddenWords, setForbiddenWords] = useState([]);
  const [results, setResults] = useState('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files[0];
    if (!file) return;
  
    const reader = new FileReader();
  
    reader.onload = (e: ProgressEvent<FileReader>) => {
      // Assert that the result is a string
      const text = e.target.result as string;
      
      const words = text.split(/[\r\n,]+/); // Adjust regex based on CSV format
      setForbiddenWords(words);
    };
  
    reader.readAsText(file);
  };

  const testFilters = () => {
    const mintFilter = new MintFilter(forbiddenWords);
    // const badWordsFilter = new Filter();

    const startTimeMint = performance.now();
    const containsForbiddenWordMint = mintFilter.verify(inputText); // Verifying with mint-filter
    const endTimeMint = performance.now();

    // const startTimeBadWords = performance.now();
    // const containsForbiddenWordBadWords =
    // badWordsFilter.clean(inputText) !== inputText; // Workaround for bad-words
    // const endTimeBadWords = performance.now();

    // setResults(`
    //   Mint Filter Verification Time: ${
    //     endTimeMint - startTimeMint
    //   }ms - Contains Forbidden Word: ${containsForbiddenWordMint}
    //   Bad Words Filter Verification Time: ${
    //     endTimeBadWords - startTimeBadWords
    //   }ms - Contains Forbidden Word: ${containsForbiddenWordBadWords}
    // `);

    setResults(`
    Mint Filter Verification Time: ${endTimeMint - startTimeMint}ms - ${
      containsForbiddenWordMint ? '沒禁字' : '有禁字'
    }`);
  };

  return (
    <div className="min-h-screen whitespace-pre-line">
      <input type="file" onChange={handleFileUpload} accept=".csv" />
      <input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Enter text to test"
        className="p-2"
      />
      <button onClick={testFilters} className="bg-blue-400 ml-4 p-1 rounded-lg">
        偵測禁字
      </button>
      <div>{results}</div>
    </div>
  );
}
