import React, { useState, useEffect } from 'react'
import './Translator.css'
import languageList from './language.json';
import axios from 'axios';

export default function Translator() {
	const [inputFormat, setInputFormat] = useState('en');
	const [outputFormat, setOutputFormat] = useState('de');
	const [translatedText, setTranslatedText] = useState('Translation');
	const [inputText, setInputText] = useState('');
	const [languages, setLanguages] = useState([]);
	const API_KEY = 'b7b3d10ee724b35f72be2d0a260f4dceca0be918';

	const handleReverseLanguage = () => {
		const value = inputFormat;
		setInputFormat(outputFormat);
		setOutputFormat(value);
		setInputText('');
		setTranslatedText('Translation');
	}

	const handleRemoveInputText = () => {
		setInputText('');
		setTranslatedText('Translation');
	}

	useEffect(() => {
		fetchLanguages();
	}, []);

	const fetchLanguages = async () => {
		try {
			const response = await axios.get(`https://translation.googleapis.com/language/translate/v2/languages?key=${API_KEY}`);
			setLanguages(response.data.data.languages);
		} catch (error) {
			console.error('Error fetching languages', error);
		}
	};

	console.log(languages);

	// const API_URL = 'https://translation.googleapis.com/language/translate/v2';
	// const handleTranslate = async (text, targetLanguage) => {
	// 	console.log(text, inputFormat, targetLanguage);
	// 	try {
	// 		const response = await axios.post(
	// 			`${API_URL}?key=${API_KEY}`,
	// 			JSON.stringify({
	// 				q: text,
	// 				target: targetLanguage,
	// 				format: 'text'
	// 			}),
	// 			{
	// 				headers: {
	// 					'Content-Type': 'application/json'
	// 				}
	// 			}
	// 		);

	// 		const translation = response.data.data.translations[0].translatedText;
	// 		setTranslatedText(translation);
	// 	} catch (error) {
	// 		console.error("Error:", error);
	// 		alert("Please Try Again! Some Error Occurred.");
	// 	}
	// };

	const handleTranslate = async (text, targetLanguage) => {
		try {
			const response = await axios.post(`https://translation.googleapis.com/language/translate/v2`, {}, {
				params: {
					q: text,
					source: inputFormat,
					target: targetLanguage,
					key: API_KEY
				}
			});  
			setTranslatedText(response.data.data.translations[0].translatedText);
		} catch (error) {
			console.error('Error translating text', error);
		}
	};

	return (
		<div className="container">
			<h2 className='mb-5'>Text Translator</h2>
			<div className="row1">
				<select value={inputFormat}
					onChange={(e) => setInputFormat(e.target.value)}>
					{Object.keys(languageList).map((key, index) => {
						const language = languageList[key];
						return (
							<option key={index} value={key}>{language.name}</option>
						);
					})}
				</select>
				<svg className='reversesvg'
					onClick={handleReverseLanguage}
					focusable="false"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24">
					<path d=
						"M6.99 11L3 15l3.99 4v-3H14v-2H6.99v-3zM21 9l-3.99-4v3H10v2h7.01v3L21 9z">
					</path>
				</svg>
				<select value={outputFormat} onChange={(e) => {
					setOutputFormat(e.target.value);
					setTranslatedText('Translation');
				}}>
					{Object.keys(languageList).map((key, index) => {
						const language = languageList[key];
						return (
							<option key={index + 118} value={key}>{language.name}</option>
						);
					})}
				</select>
			</div>
			<div className="row2">
				<div className="inputText">
					<svg className='removeinput'
						style={{ display: (inputText.length) ? "block" : "none" }}
						onClick={handleRemoveInputText}
						focusable="false"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24">
						<path d=
							"M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z">
						</path>
					</svg>
					<textarea type="text"
						value={inputText}
						placeholder='Enter Text'
						onChange={(e) => setInputText(e.target.value)} />
				</div>
				<div className="outputText">{translatedText}</div>
			</div>
			<div className="row3">
				<button className='btn btn-primary'
					onClick={() => handleTranslate(inputText, outputFormat)}
				>
					<i className="fa fa-spinner fa-spin"></i>
					<span className='translate'>Translate</span>
				</button>
			</div>
		</div>
	)
}