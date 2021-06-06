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

class Content extends React.Component {
    render() {
        return (
            <div className="content">
                <h1 className="title">Ez Dash</h1>
                <Graph title = "Rendimentos Semanais"/>
                <ListaItens text = "Alerta: estoque baixo"/>
                <ListaItens text = "Mais Vendidos da Semana"/>
                <Graph title = "Quantidades de Vendas Mensais"/>
                
            </div>
        );

    }
}

function ListaItens(props){
    const li = [
        "Produto 1",
        "Produto 2",
        "Produto 3",
    ]

    const listItems = li.map((item,x) =>
        <li className="item_list" key={x}>{item}</li>
    );

    return(
        <ol className="lista_itens">
            <h1 className="title_list">{props.text}</h1>
            {listItems}
        </ol>
        
    );
    
}

function Graph(props) {
    return (
        <div className = "graph">
            <Plot
                data={[
                    {
                        x: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                        y: [20, 14, 23, 42, 33, 62],
                        type: 'bar',
                        marker: {
                            color: ['cf5d83', 'c85dcf', '805dcf', '5d92cf', '5dcfc8', '5dcf82']
                        },
                        
                    },
                ]}
                layout={{ width: 320, height: 240, title: props.title,paper_bgcolor:'rgba(0,0,0,0)'}}
            />
        </div>

    );
}

function SideBar() {
    return (
            <div className="side-bar">
                <SideBarButton text="Home" pth="/" />
                <SideBarButton text="Vendas" pth= "/vendas"/>
                <SideBarButton text="Clientes" />
                <SideBarButton text="Produtos" />
            </div>
        

    );

}

function Page(props) {

    return (
            <div className="collumn">
                <SideBar />
                <Content />
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

function SideBarButton(props) {
    return (
        <div className="item">
            <Link className="button_btn" to={props.pth}>{props.text}</Link>
        </div>
    );
}

ReactDOM.render(
    <Router>
        <Switch>
            <Route exact path="/">
                <Page/>
            </Route>
            <Route exact path="/vendas">
                <Vendas/>
            </Route>
        </Switch>
    </Router>
    , document.getElementById("root"));