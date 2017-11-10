import React, { Component } from 'react'
import Axios from 'axios'
import Dictionary from 'japaneasy'
const translate = new Dictionary({
    dictionary: "glossing", timeout: 500
})

// import {Button} from 'stardust'

class Translator extends Component {

    constructor(props) {
        super(props)
        this.state = {
            input: "",
            output: "",
            definition: "",
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
            .then(_ => translate(this.state.output).then(definition => {
                console.log(JSON.stringify(definition))
                this.setState({ definition })
            }))
    }

    onSelect(event) {
        this.setState({ translationPath: event.target.value, input: '', output: '' })
    }


    render() {
        return (
            <div className="wrapper">
                <nav className="one">
                    <h1> クルリ</h1>
                </nav>
                <header className="five">
                    <button onClick={this.onClick}>Translate</button>
                    <select onChange={(event) => this.onSelect(event)}>
                        <option value='from=ja&to=en'> JPN to ENG</option>
                        <option value='from=en&to=ja'> ENG to JPN</option>
                    </select>
                </header>
                <header className="six">
                    <button>Speech</button>
                </header>
                <textarea className="two" value={this.state.input} onChange={(event) => this.onChange(event)} />
                <div className="three" id="output">{`=> ${this.state.output}`}</div>
                <textarea className="four" defaultValue="Store Text HERE" />
            </div>
        )

    }
}

export default Translator