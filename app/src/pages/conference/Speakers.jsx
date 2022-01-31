import React from 'react';
import './style-sessions.css';
import { useParams } from 'react-router-dom'
import { gql, useMutation, useQuery } from '@apollo/client';

const FEATURED_SPEAKER = gql`
    mutation updateFeatured($speakerId: ID!, $featured: Boolean!) {
        markFeatured(speakerId: $speakerId, featured: $featured) {
            id
            featured
        }
    }
`;

const SPEAKER_FRAGMENT = gql`
    fragment SpeakerInfo on Speaker {
        id
        name
        bio
        sessions {
            id
            title
        }
        featured
    }
`;

const SPEAKERS = gql`
    query speakers {
        speakers {
            ...SpeakerInfo
        }
    }
    ${SPEAKER_FRAGMENT}
`;

const SPEAKER_BY_ID = gql`
    query speakerById($id: ID!) {
        speakerById(id: $id) {
            ...SpeakerInfo
        }
    }
    ${SPEAKER_FRAGMENT}
`;

const SpeakerList = () => {
    const { loading, error, data } = useQuery(SPEAKERS);
    const [updateFeatured] = useMutation(FEATURED_SPEAKER);

    if (loading) return <p>Loading Speakers...</p>
    if (error) return <p>Error Loading Speakers!</p>

    return data.speakers.map(({ id, name, bio, featured, sessions }) => (
        <div key={id} className="col-xs-12 col-sm-6 col-md-6" style={{padding:5}}>
            <div className="panel panel-default">
                <div className="panel-heading">
                    <h3 className="panel-title">{'Speaker: ' + name}</h3>
                </div>
                <div className="panel-body">
                    <h5>{'Bio: ' + bio}</h5>
                </div>
                <div className="panel-footer">
                    <h3 className="panel-title">{'Sessions'}</h3>
                    {
                        sessions.map((s) => (
                            <span key={s.id} style={{padding:2}}>
                                <p>{s.title}</p>
                            </span>
                        ))
                    }
                    <span>
                        <button type="button" className="btn btn-default btn-sm" onClick={ async() => {await updateFeatured({variables: {speakerId: id, featured: true}})} }>
                            <i className={`fa ${featured ? "fa-star" : "fa-star-o"}`} aria-hidden="true" style={{color:featured?"gold":undefined}}></i>{" "}
                            Featured Speaker
                        </button>
                    </span>
                </div>
            </div>
        </div>
    ));
}

const SpeakerDetails = () => {
    const { speaker_id } = useParams();

    console.log('speaker_id ', speaker_id);
    const { loading, error, data } = useQuery(SPEAKER_BY_ID, {
        variables: { id: speaker_id }
    });

    if (loading) return <p>Loading Speaker...</p>
    if (error) return <p>Error Loading Speaker!</p>

    const speaker = data.speakerById;
    const { id, name, bio, sessions } = speaker;
    return (
        <div key={id} className="col-xs-12 col-sm-6 col-md-6" style={{padding:5}}>
            <div className="panel panel-default">
                <div className="panel-heading">
                    <h3 className="panel-title">{'Speaker: ' + name}</h3>
                </div>
                <div className="panel-body">
                    <h5>{'Bio: ' + bio}</h5>
                </div>
                <div className="panel-footer">
                    <h3 className="panel-title">{'Sessions'}</h3>
                    {
                        sessions.map((s) => (
                            <span key={s.id} style={{padding:2}}>
                                <p>{s.title}</p>
                            </span>
                        ))
                    }
                </div>
            </div>
        </div>
    );
}

export function Speakers() {
    return (
        <>
            <div className="container">
                <div className="row">
                    <SpeakerList />
                </div>
            </div>
        </>
    )
}

export function Speaker() {
    return (
        <>
            <div className="container">
                <div className="row">
                    <SpeakerDetails />
                </div>
            </div>
        </>
    )
}