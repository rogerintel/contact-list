import React, {useEffect, useRef, useState} from "react";
import './App.css';
import Tabletop from 'tabletop'
import {Card, CardColumns, Form} from "react-bootstrap";
import {FaWhatsapp} from "react-icons/all";


function App() {
    const [data, setData] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const inputRef = useRef(null);
    const checkComRef = useRef(null);
    const checkOpeRef = useRef(null);

    const onInputChanged = () => {
        setFiltered(data.filter(item => (
            item.Base.toLowerCase().includes(inputRef.current.value.toLowerCase()) ||
            item.Executivo.toLowerCase().includes(inputRef.current.value.toLowerCase())
        )));
    }
    const onCheckChanged = () => {
        console.log(`comercial = ${checkComRef.current.checked} \n operacional = ${checkOpeRef.current.checked}`)
        setFiltered(data.filter(item => (
            item.Base.toLowerCase().includes(inputRef.current.value.toLowerCase()) ||
            item.Executivo.toLowerCase().includes(inputRef.current.value.toLowerCase())
        )));
        if(checkOpeRef.current.checked){
            if (!checkComRef.current.checked) {
                setFiltered(filtered.filter(item => (item.Setor.toLowerCase().includes("operação"))));
            }
        } else {
            if (checkComRef.current.checked) {
                setFiltered(filtered.filter(item => (item.Setor.toLowerCase().includes("comercial"))));
            }
        }
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
        const regex = /^\(?([0-9]{2})\)?([0-9]{4,5})-?([0-9]{4})$/mg;
        const subst = `($1) $2-$3`;
        return Telefone.replace(regex, subst);

    }
    return (
        <Form style={{backgroundColor: 'rgba(229, 228, 235, 1)'}}>
            <Form.Control className="border border-primary rounded-pill" ref={inputRef} type="text"
                          placeholder="Pesquisar Base ou Executivo"
                          onChange={onInputChanged}/>
            <Form.Group className="container">
                <Form.Check ref={checkComRef}
                    inline
                    defaultChecked={false}
                    label={"Comercial"}
                    id="check-cargo-comercial"
                    onClick={onCheckChanged}
                />
                <Form.Check ref={checkOpeRef}
                    inline
                    defaultChecked={false}
                    label={"Operação"}
                    id="check-cargo-operacional"
                    onClick={onCheckChanged}
                />
            </Form.Group>
            <CardColumns className="m-2">
                {filtered.map((item, i) => (

                    <Card key={i} bg="light" text="dark" border="primary">
                        <Card.Body>
                            <Card.Title>
                                {item.Base}
                            </Card.Title>
                            <Card.Text>
                                {item.Executivo}
                                <p className="small">{item.Cargo}</p>
                            </Card.Text>
                        </Card.Body>
                        <Card.Footer className="d-flex justify-content-around">
                            <a href={"https://api.whatsapp.com/send?phone=55" + item.Telefone + "&text="
                            + encodeURI("Olá, " + item.Executivo + " pode me ajudar?")} target="_blank" rel="noreferrer"
                            >
                                <FaWhatsapp className="text-info" size="30px"/></a>

                            <a href={"tel:" + item.Telefone}
                               className="btn btn-outline-secondary">{maskFone(item.Telefone)}</a>
                        </Card.Footer>

                    </Card>
                ))}
            </CardColumns>

        </Form>
    );
}

export default App;
