import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Plot from 'react-plotly.js';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

import { readString } from 'react-papaparse'


class App extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            hasFile: false,
            fileContent: null,
            weekSells: {
                dates: null,
                data: null,
            },
            monthSells: {
                dates: null,
                data: null,
            }
        };
        this.getFileContent = this.getFileContent.bind(this)
    }

    getFileContent(input) {
        this.setState({
            hasFile: true,
            fileContent: input,
        });
        console.log(this.state.fileContent);
        this.parserWeekSells(input);
        this.parserMonthSells(input)
    }

    parserMonthSells(input){
        let result = readString(input);
        let arr = result.data;
        let data = []
        let date = []
        let y = 0;
        let j = 0;

        for (let i = 0; i < arr.length; i++) {
            if (arr[i][4] !== undefined) {
                let auxDate = arr[i][5];
                let month = auxDate.split("/")[1];
                if(date[y] === parseInt(month)){
                    if(data[j] === undefined){
                        data[j] = 0;
                    }
                    data[j] += parseInt(arr[i][4]);
                }else{
                    if(date[y]===undefined){
                        date[y] = parseInt(month)
                    }else{
                        y++;
                        date[y] = parseInt(month)
                        j++;
                        if(data[j] === undefined){
                            data[j] = 0;
                        }
                        data[j] += parseInt(arr[i][4]);
                    }
                }
            
            }
        
        }
        //console.log(data, date);
        this.setState({
            monthSells: {
                dates: date,
                data: data,
            }
        });

    }

    parserWeekSells(input) {
        let result = readString(input);
        let arr = result.data;
        let data = []
        let date = []
        let y = 0;
        let j = 0;
        console.log("Numero de items: ", result.data.length);
        for (let i = 0; i < arr.length; i++) {
            //console.log(arr[i][4]);
            if (arr[i][4] !== undefined) {
                
                if(date[y] === arr[i][5]){
                    if(data[j] === undefined){
                        data[j] = 0;
                    }
                    data[j] += parseInt(arr[i][4]);
                }else{
                    if(date[y]===undefined){
                        date[y] = arr[i][5]
                    }else{
                        y++;
                        date[y] = arr[i][5]
                        j++;
                        if(data[j] === undefined){
                            data[j] = 0;
                        }
                        data[j] += parseInt(arr[i][4]);
                    }
                }
            }
        }
        //console.log(data, date);
        this.setState({
            weekSells: {
                dates: date,
                data: data,
            }
        });
    }

    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path="/">
                        <Page weekSells={this.state.weekSells} monthSells={this.state.monthSells} />
                    </Route>
                    <Route exact path="/vendas">
                        <AddArquivo handleFileContent={this.getFileContent} />
                    </Route>
                </Switch>
            </Router>
        );
    }
}

function Upload(props) {


    let fileReader;

    const handleFileRead = (e) => {
        const content = fileReader.result;
        // … do something with the 'content' …
        props.handleFileContent(content);
    };

    const handleFileChosen = (file) => {
        fileReader = new FileReader();
        fileReader.onloadend = handleFileRead;
        fileReader.readAsText(file);
    };

    return (
        <div className='upload-expense'>
            <input
                type='file'
                id='file'
                className='input-file'
                accept='.csv'
                onChange={e => handleFileChosen(e.target.files[0])}
            />
        </div>
    );

}

class Content extends React.Component {



    render() {
        return (
            <div className="content">
                <h1 className="title">Ez Dash</h1>
                <Graph title="Rendimentos Semanais" data={this.props.weekSells} type="csv-data" />
                <ListaItens text="Alerta: estoque baixo" />
                <ListaItens text="Mais Vendidos da Semana" />
                <Graph title="Quantidades de Vendas Mensais" data={this.props.monthSells} type="csv-data" />

            </div>
        );

    }
}

function ListaItens(props) {
    const li = [
        "Produto 1",
        "Produto 2",
        "Produto 3",
    ]

    const listItems = li.map((item, x) =>
        <li className="item_list" key={x}>{item}</li>
    );

    return (
        <ol className="lista_itens">
            <h1 className="title_list">{props.text}</h1>
            {listItems}
        </ol>

    );

}

function Graph(props) {

    if (props.type === "csv-data") {
        return (
            <div className="graph">
                <Plot
                    data={[
                        {
                            x: props.data.dates,
                            y: props.data.data,
                            type: 'bar',
                            marker: {
                                color: ['cf5d83', 'c85dcf', '805dcf', '5d92cf', '5dcfc8', '5dcf82']
                            },

                        },
                    ]}
                    layout={{ width: 320, height: 240, title: props.title, paper_bgcolor: 'rgba(0,0,0,0)' }}
                />
            </div>

        );
    } else {
        return (
            <div className="graph">
                <Plot
                    data={[
                        {
                            x: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                            y: [0, 0, 0, 0, 0, 0],
                            type: 'bar',
                            marker: {
                                color: ['cf5d83', 'c85dcf', '805dcf', '5d92cf', '5dcfc8', '5dcf82']
                            },

                        },
                    ]}
                    layout={{ width: 320, height: 240, title: props.title, paper_bgcolor: 'rgba(0,0,0,0)' }}
                />
            </div>

        );
    }


}

function SideBar() {
    return (
        <div className="side-bar">
            <SideBarButton text="Home" pth="/" />
            <SideBarButton text="Vendas" pth="/vendas" />
            <SideBarButton text="Clientes" pth="/clientes" />
            <SideBarButton text="Produtos" pth="/produtos" />
        </div>


    );

}

function Page(props) {

    return (
        <div className="collumn">
            <SideBar />
            <Content weekSells={props.weekSells} monthSells={props.monthSells} />
        </div>
    );

}

function Vendas(props) {

    return (
        <div className="collumn">
            <SideBar />
        </div>
    );

}

function AddArquivo(props) {
    return (
        <div className="collumn">
            <SideBar />
            <Upload handleFileContent={props.handleFileContent} />
        </div>
    );
}

function SideBarButton(props) {
    return (
        <div className="item">
            <Link className="button_btn" to={props.pth}>{props.text}</Link>
        </div>
    );
}

ReactDOM.render(
    <App />
    , document.getElementById("root"));