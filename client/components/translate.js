import React, { Component } from 'react'
import Axios from 'axios'
import Dictionary from 'japaneasy'
const translate = new Dictionary({
    dictionary: "glossing", timeout: 500
})
import Sound from 'react-sound';
import ToggleDisplay from 'react-toggle-display';

class Translator extends Component {

    constructor(props) {
        super(props)
        this.state = {
            input: "",
            output: "",
            dictionary: '',
            definition: '',
            translationPath: 'from=ja&to=en',
            speech: <div />,
            show: false
        }
        this.onChange = this.onChange.bind(this)
        this.handleTranslateClick = this.handleTranslateClick.bind(this)
        this.onSelect = this.onSelect.bind(this)
        this.onSpeechClick = this.onSpeechClick.bind(this)
        this.handleDictionaryClick = this.handleDictionaryClick.bind(this)
        this.handleSwapClick = this.handleSwapClick.bind(this)
    }

    onChange(event) {
        this.setState({ input: event.target.value })
    }

    handleTranslateClick() {
        Axios.post(`/api/translate/?${this.state.translationPath}`, {
            text: this.state.input
        })
            .then(res => {
                this.setState({ output: res.data })
            })
            .then(_ => {
                if (this.state.translationPath === 'from=ja&to=en') return translate(this.state.input)
                else return translate(this.state.output)
            })
            .then(definition => {
                const createdDictionary = this.createDictionary(definition)
                this.setState({ dictionary: createdDictionary, show:false })
            })
    }

    handleSwapClick() {
        const tempInput = this.state.input
        this.setState({input: this.state.output, output: "", dictionary: "", translationPath: 'from=en&to=ja'})
    }

    onSpeechClick() {
        let language = this.state.translationPath === 'from=ja&to=en' ? 'en' : 'ja'
        return Axios.post('/api/translate/speech', {
            text: this.state.output,
            language: language
        })
            .then(res => res.data)
            .then(url => {
                this.setState({ speech: "" })

                this.setState({
                    speech: <Sound
                        url={url}
                        playStatus={Sound.status.PLAYING}
                    />
                })
            })
    }

    onSelect(event) {
        this.setState({ translationPath: event.target.value, input: '', output: '', dictionary: ''})
    }

    handleDictionaryClick() {
        this.setState({
          show: !this.state.show
        });
      }

    createDictionary(translation) {
        let dictionary = translation.map((entry, i) => (
                <div key={i} className="dictdef">
                    <p>{entry.japanese}</p>
                    <p>{entry.pronunciation}</p>
                    <p>{entry.english[0]}</p>
                </div>
        ))
        return dictionary
    }
    
    render() {
        return (
            <div className="wrapper">
                <div id="titlebar"> <img src="https://i.imgur.com/HJZPqtB.png"/> by Simon Chan</div>
                <div id="inputheader">
                    <button onClick={this.handleTranslateClick}>Translate</button>
                    <select onChange={(event) => this.onSelect(event)}>
                        <option value='from=ja&to=en'> JPN to ENG</option>
                        <option value='from=en&to=ja'> ENG to JPN</option>
                    </select>
                    <button onClick={this.handleSwapClick}>Swap</button>
                </div>
                <div id="outputheader">
                    <button onClick={this.onSpeechClick}>Speech</button>
                    <button onClick={this.handleDictionaryClick}>Dictionary</button>                    
                </div>
                <textarea id="inputbox" value={this.state.input} onChange={(event) => this.onChange(event)} />
                <textarea id="inputbottom" defaultValue="Store Text HERE" />
                <div id="outputbox">{`=> ${this.state.output}`}
                    <ToggleDisplay show={this.state.show}>{this.state.dictionary}</ToggleDisplay>
                </div>
                <div>{this.state.speech}</div>
            </div>
        )

    }
}

export default Translator



