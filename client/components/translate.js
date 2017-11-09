import React, { Component } from 'react'
import Axios from 'axios'
import Dictionary from 'japaneasy'
const translate = new Dictionary({ dictionary: "glossing" })
// import {Button} from 'stardust'

class Translator extends Component {

    constructor(props) {
        super(props)
        this.state = {
            input: "",
            output: "",
            definition: {},
            translationPath: 'from=ja&to=en'
        }
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.onSelect = this.onSelect.bind(this)
    }

    onChange(event) {
        this.setState({ input: event.target.value })
    }

    onSubmit(event) {
        event.preventDefault()
        Axios.post(`/api/translate/?${this.state.translationPath}`, {
            text: this.state.input
        })
            .then(res => {
                this.setState({ output: res.data })
            })
            .then(_ => translate(this.state.output).then(definition => {
                console.log(definition)
                //console.log(this.state.output)
            }))
    }

    onSelect(event) {
        this.setState({translationPath: event.target.value, input: '', output: ''})
    }

    render() {
        return (
            <div>
                <h1>
                    TRANSLATE SOMETHING
                </h1>
                <select onChange={(event) => this.onSelect(event)}>
                    <option value='from=ja&to=en'> JPN to ENG</option>
                    <option value='from=en&to=ja'> ENG to JPN</option>
                </select>
                <form onSubmit={(event) => this.onSubmit(event)}>
                    <input value={this.state.input} onChange={(event) => this.onChange(event)} />
                    <button>Translate</button>
                </form>
                <div>{this.state.output}</div>
            </div>
        )

    }
}

export default Translator