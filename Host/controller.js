'use strict';
import Fs from 'fs-extra-promise'
import WebClient from 'javascript-web-client'

class Controller {
    constructor() {
        this.context = {storeid:1,storetype:4};
    }
    async getTemplate(name){
        try {
            let file = await Fs.readFileAsync(__dirname + name)
            return String(file)
        } catch (e) {
            console.log('error: ', e)
        }  
    }
    parseTamplate(template){
        let regex = /\[\[\[([\s\S]+?)\]\]\]/gi
        let widgets=[]
        let m
        while ((m = regex.exec(template)) !== null) {
            if (m.index === regex.lastIndex) {
                regex.lastIndex++
            }
            widgets.push({key:m[0],value:m[1]})
        }
        return widgets
    }
    // {
    //     "name":"header",
    //     "host":"http://api/webparts",
    //     "path":"/header?id={id}&storeid={storeid}",
    //     "parameters":{"id":1,"storeid":"{storeid}"},
    // }
    async getWidget(widgetString) {
        let widget = JSON.parse(widgetString)
        widget.path = this.initParameter(widget)
        let client = new WebClient(widget.host)
        let response = await client.request(widget.path,{})
        return response.body
    }

    initParameter(widget){;
        let paras = widget.parameters
        let keys = Object.keys(paras)
        let path = widget.path
        keys.forEach((name, index) => {
            path = path.replace(`{${name}}`,paras[name])
        })

        keys = Object.keys(this.context)
        keys.forEach((name, index) => {
            path = path.replace(`{${name}}`,this.context[name])
        })
        return path
    }

    async render(){
        let template = await this.getTemplate("/views/index.html")
        let widgets = this.parseTamplate(template)
        for (let widget of widgets){
            let tempContent = await this.getWidget(widget.value)
            template = template.replace(widget.key, tempContent)
        }

        return template
    }
}

export default Controller