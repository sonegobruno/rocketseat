import React, { useState, useEffect, FormEvent } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';

import { Title, Form, Repositories, Error } from './styles';

import logo from '../../assets/logo.svg';

import { FiChevronRight } from 'react-icons/fi';

interface Repository {
    full_name: string;
    description: string;
    owner: {
        login: string;
        avatar_url: string;

    };
}

const Dashboard: React.FC = () => {
    const [repositories, setRepositories] = useState<Repository[]>(() => {
        const storagedRepositories = localStorage.getItem('@githubExplorer:repositories');

        if(storagedRepositories) {
            return JSON.parse(storagedRepositories);
        } else {
            return [];
        }
    });
    const [newRepo, setNewRepo] = useState('');
    const [inputError, setInputError] = useState('');


    useEffect(() => {
        localStorage.setItem('@githubExplorer:repositories', JSON.stringify(repositories));
    },[repositories]);

    async function handleAddRepository(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();

        if(!newRepo) {
            setInputError('Digite o autor/nome do repositorio');
            return;
        }

        try {
            const response = await api.get<Repository>(`repos/${newRepo}`);

            const repository = response.data;
    
            setRepositories([...repositories, repository]);
            setNewRepo('');
            setInputError('');
        } catch(err) {
            setInputError('Erro na busca por esse repositorio');
        }
    }


    return (
        <>
            <img src={logo} alt="logo"></img>
            <Title>Explore repositórios no Github</Title>
        
            <Form hasError={!!inputError} onSubmit={handleAddRepository}>
                <input 
                    placeholder="Digite o nome do repositorio"
                    value={newRepo}
                    onChange={e => setNewRepo(e.target.value)}
                />
                <button type="submit">Pesquisar</button>
            </Form>

            {inputError && <Error>{inputError}</Error>}

            <Repositories>
                {repositories.map(repository => (
                    <Link key={repository.full_name} to={`/repositories/${repository.full_name}`}>
                    <img
                        src={repository.owner.avatar_url}
                        alt={repository.owner.login}
                    />
                    <div>
                        <strong>{repository.full_name}</strong>
                        <p>{repository.description}</p>
                    </div>
                <FiChevronRight size={20} />
                </Link>
                ))}
            </Repositories>
        </>
    );
};

export default Dashboard;