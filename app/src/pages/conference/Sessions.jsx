import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import './style-sessions.css';
import { gql, useMutation, useQuery } from '@apollo/client';
import { Formik, Field, Form } from 'formik';

const SESSIONS_FRAGMENT = gql`
    fragment SessionInfo on Session {
        id
        title
        day
        room
        startsAt
        level
        description @include(if: $isDescription)
        speakers {
            id
            name
        }
    }
`;

const CREATE_SESSION = gql`
    mutation createSession ($session: SessionInput!) {
        createSession(session: $session) {
            ...SessionInfo
        }
    }
`;

const SESSIONS = gql`
    query sessions($day: String!, $isDescription: Boolean!) {
        intro: sessions(day: $day, level: "Introductory and overview") {
            ...SessionInfo
        }
        intermediate: sessions(day: $day, level: "Intermediate") {
            ...SessionInfo
        }
        advanced: sessions(day: $day, level: "Advanced") {
            ...SessionInfo
        }
    }
    ${SESSIONS_FRAGMENT}
`;

const ALL_SESSIONS = gql`
	query sessions {
    sessions {
      ...SessionInfo
    }
	}
  ${SESSIONS_FRAGMENT}
`;

const SessionList = ( { day } ) => {
    let isDescription = true;
    const { loading, error, data } = useQuery(SESSIONS, {
        variables: {day, isDescription}
    });

    if (loading) return <p>Loading Sessions...</p>
    if (error) return <p>Error Loading Sessions!</p>

    const results = [];
    results.push(data.intro.map(s => (
        <SessionItem key={s.id} session={{...s}} />
    )));
    results.push(data.intermediate.map(s => (
        <SessionItem key={s.id} session={{...s}} />
    )));
    results.push(data.advanced.map(s => (
        <SessionItem key={s.id} session={{...s}} />
    )));

    return results;
}

function SessionItem( { session }) {
    const { id, title, day, room, startsAt, description, level, speakers } = session
    return (
        <div key={id} className="col-xs-12 col-sm-6" style={{padding:5}}>
            <div className="panel panel-default">
                <div className="panel-heading">
                    <h3 className="panel-title">{title}</h3>
                </div>
                <div className="panel-body">
                    <h5>{`Day: ${day}`}</h5>
                    <h5>{`Room Number: ${room}`}</h5>
                    <h5>{`Starts At: ${startsAt}`}</h5>
                    {description && <h5>{`Description: ${description}`}</h5>}
                    <h5><strong>{`Level: ${level}`}</strong></h5>
                </div>

                <div className="panel-footer">
                    {speakers.map(({id, name }) => (
                        <span key={id} style={{padding:2}}>
                            <Link className="btn btn-default btn-lg" to={`/conference/speaker/${id}`}>View {name}'s Profile</Link>
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}

function SessionForm() {
    const updateSessions = (cache, {data}) => {
        cache.modify({
            fields: {
                sessions(existingSessions = []) {
                    const newSession = data.createSession;
                    cache.writeQuery({
                        query: ALL_SESSIONS,
                        data: {newSession, ...existingSessions}
                    })
                }
            }
        })
    };
    const [create, { called, error }] = useMutation(CREATE_SESSION, {
        update: updateSessions
    });

    if (error)  return <p>Session Failed To Submit!</p>
    if (called) return <p>Session Submitted Successfully...</p>

    return (
        <div style={{width:"100%", display:"flex", alignContent:"center", justifyContent:"center", padding:10}}>
            <Formik initialValues={{title:"", description:"", day:"", level:""}} onSubmit={ async (values) => { await create( {variables: {session: values }}) }}>
                { () => (
                    <Form style={{width:"100%", naxWidth:500}}>
                        <h3 className="h3 mb-3 font-weight-normal">Submit a Session</h3>
                        <div className="mb-3" style={{paddingBottom:5}}>
                            <label htmlFor="imputTitle">Title</label>
                            <Field id="inputTitle" className="form-control" required autoFocus name="title" />
                        </div>
                        <div className="mb-3" style={{paddingBottom:5}}>
                            <label htmlFor="inputDescription">Description</label>
                            <Field id="inputDescription" className="form-control" type="textarea" required name="description" />
                        </div>
                        <div className="mb-3" style={{paddingBottom:5}}>
                            <label htmlFor="inputDay">Day</label>
                            <Field id="inputDay" className="form-control" required name="day" />
                        </div>
                        <div className="mb-3" style={{paddingBottom:5}}>
                            <label htmlFor="inputLevel">Level</label>
                            <Field id="inputLevel" className="form-control" required name="level" />
                        </div>
                        <div style={{justifyContent:"center", alignCOntent:"center"}}>
                            <button className="btn btn-primary">Submit</button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
}

export function Sessions() {
    const [day, setDay] = useState("");
    return (
        <>
            <section className="banner">
                <div className="container">
                    <div className="row" style={{padding:10}}>
                        <Link className="btn btn-lg center-block" to={`/conference/sessions/add`}>Submit A Session</Link>
                    </div>
                    <div className="row">
                    <button type="button" onClick={() => setDay('All')} className="btn-oval">
                            All Sessions
                        </button>
                        <button type="button" onClick={() => setDay('Wednesday')} className="btn-oval">
                            Wednesday
                        </button>
                        <button type="button"  onClick={() => setDay('Thursday')} className="btn-oval">
                            Thursday
                        </button>
                        <button type="button" onClick={() => setDay('Friday')} className="btn-oval">
                            Friday
                        </button >
                    </div>
                    <div className="row">
                        <SessionList day={day} />
                    </div>
                </div>
            </section>
        </>
    )
}

export function AddSession() {
    return (
        <>
            <section className="banner">
                <div className="container">
                    <div className="row">
                        <SessionForm />
                    </div>
                </div>
            </section>
        </>
    )
}