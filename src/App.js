import React, {useEffect, useRef, useState} from "react";
import './App.css';
import Tabletop from 'tabletop'
import {Card, CardColumns, Form} from "react-bootstrap";
import {FaWhatsapp} from "react-icons/all";


function App() {
    const [data, setData] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const inputRef = useRef(null);

    const onInputChanged = () => {
        console.log(process.env.REACT_APP_SPREEDSHEET_ID)
        setFiltered(data.filter(item => (
            item.Base.toLowerCase().includes(inputRef.current.value.toLowerCase()) ||
            item.Executivo.toLowerCase().includes(inputRef.current.value.toLowerCase())
        )));
    }


    useEffect(() => {
        Tabletop.init({
            key: process.env.REACT_APP_SPREEDSHEET_ID,
            simpleSheet: true
        })
            .then((data) => {
                setData(data)
                setFiltered(data)
            })
            .catch((err) => console.warn(err));
    }, []);

    return (
        <>
            <Form>
                <Form.Group>
                    <Form.Control ref={inputRef} size="lg" type="text" placeholder="Pesquise uma Base ou um Executivo"
                                  onChange={onInputChanged}/>
                </Form.Group>
                <br />
            </Form>

            <CardColumns>
                {filtered.map((item, i) => (

                    <Card key={i} bg="light" text="dark" border="primary">
                        <Card.Body>
                            <Card.Title>
                                Base: {item.Base}
                            </Card.Title>
                            <Card.Text>
                                {item.Executivo}
                            </Card.Text>
                        </Card.Body>
                        <Card.Footer>
                                <pre>
                                <a href={"https://api.whatsapp.com/send?phone=55" + item.Telefone + "&text="
                                + encodeURI("Olá, " + item.Executivo + " pode me ajudar?")} target="_blank">
                                <FaWhatsapp color="green" size="22px"/></a>  <a href={"tel:" + item.Telefone}>{item.Telefone}</a>
                                    </pre>
                        </Card.Footer>
                    </Card>
                ))}
            </CardColumns>

        </>
    );
}

export default App;
