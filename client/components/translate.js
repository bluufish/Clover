import React, { Component } from 'react'
import Axios from 'axios'
import Dictionary from 'japaneasy'
const translate = new Dictionary({
    dictionary: "glossing", timeout: 500
})
import hotkeys from 'hotkeys-js';

const createDictionary = (translation) => {
    const dictionaryEntries = translation.map((entry, i) => (
        <div key={i}>
            <p>{entry.japanese}</p>
            <p>{entry.pronunciation}</p>
            <ul>{entry.english.map((definition,i) => (
                <li key={i}>{definition}</li>
            ))}</ul>
        </div>
    ))
    // const dictionaryEntries = translation.map(entry => (
    //     entry.japanese + entry.pronunciation
    // ))


    return dictionaryEntries
}

class Translator extends Component {

    constructor(props) {
        super(props)
        this.state = {
            input: "",
            output: "",
            definition: [],
            translationPath: 'from=ja&to=en'
        }
        this.onChange = this.onChange.bind(this)
        this.onClick = this.onClick.bind(this)
        this.onSelect = this.onSelect.bind(this)
    }

    onChange(event) {
        this.setState({ input: event.target.value })
    }

    onClick() {
        Axios.post(`/api/translate/?${this.state.translationPath}`, {
            text: this.state.input
        })
            .then(res => {
                this.setState({ output: res.data })
            })
            .then(_ => {
                if (this.state.translationPath === 'from=ja&to=en') return translate(this.state.input)
                else return translate(this.state.output)
            }).then(definition => {
                const createdDictionary = createDictionary(definition)
                this.setState({definition: createdDictionary})
            })
    }

    onSelect(event) {
        this.setState({ translationPath: event.target.value, input: '', output: '' })
    }


    render() {
        return (
            <div className="wrapper">
                <h1 id="titlebar">クルリ</h1>
                <div id="inputheader">
                    <button onClick={this.onClick}>Translate</button>
                    <select onChange={(event) => this.onSelect(event)}>
                        <option value='from=ja&to=en'> JPN to ENG</option>
                        <option value='from=en&to=ja'> ENG to JPN</option>
                    </select>
                </div>
                <div id="outputheader">
                    <button>Speech</button>
                </div>
                <textarea id="inputbox" value={this.state.input} onChange={(event) => this.onChange(event)} />
                <textarea id="inputbottom" defaultValue="Store Text HERE" />
                <div id="outputbox">{`=> ${this.state.output}`}{this.state.definition}</div>
            </div>
        )

    }
}

export default Translator