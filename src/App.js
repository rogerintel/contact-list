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

    function maskFone(Telefone) {
        const regex = /^\(?([0-9]{2})\)?([0-9]{4,5})\-?([0-9]{4})$/mg;
        const subst = `($1)$2-$3`;
        const Tel2 = Telefone.replace(regex, subst);
        return Tel2;

    }

    return (
        <>
            <Form>
                <Form.Group>
                    <Form.Control className="border border-primary rounded-pill" ref={inputRef} size="lg" type="text"
                                  placeholder="Pesquise uma Base ou um Executivo"
                                  onChange={onInputChanged}/>
                </Form.Group>
                <br/>
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

                        <Card.Footer className="container d-flex justify-content-center">
                            <a href={"https://api.whatsapp.com/send?phone=55" + item.Telefone + "&text="
                            + encodeURI("Olá, " + item.Executivo + " pode me ajudar?")} target="_blank"
                               className="mr-3 align-self-center">
                                <FaWhatsapp className="text-info" size="30px"/></a>

                            <a href={"tel:" + item.Telefone}
                               className="btn btn-outline-secondary">{maskFone(item.Telefone)}</a>
                        </Card.Footer>

                    </Card>
                ))}
            </CardColumns>

        </>
    );
}

export default App;
