import React, { useState, useEffect } from 'react';
import { Progress, Spinner, addToast } from '@heroui/react';
import axios from 'axios';
import type { Idea } from '../types';
import IdeaCard from '../components/IdeaCard';

interface ApiResponse {
    ideas: Idea[];
    votesLimit: number;
    remainingVotesCount: number;
}

const Home: React.FC = () => {
    const [data, setData] = useState<ApiResponse>({
        ideas: [],
        votesLimit: 0,
        remainingVotesCount: 0,
    });

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchIdeas = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get('/api/ideas');
                setData(response.data);
                setError(null);
            } catch (err) {
                setError('Ошибка при загрзки данных голосования. Мы уже работаем над ее исправлением. Попробуйте позже.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchIdeas();
    }, []);

    const handleVote = async (id: string) => {
        try {
            await axios.post(`/api/ideas/${id}/vote`);

            setData({
                ...data,
                remainingVotesCount: data.remainingVotesCount - 1,
                ideas: data.ideas.map((idea) =>
                    idea.id === id
                        ? { ...idea, votesCount: idea.votesCount + 1, isVoted: true }
                        : idea,
                ),
            });
        } catch (err) {
            addToast({
                title: 'Ошибка',
                description: 'Произошла ошибка при голосовании. Мы уже работаем над ее исправлением. Попробуйте позже.',
                color: 'danger',
            });
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner size="lg" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <main className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">
                Голосование
            </h1>
            <div className="mb-4">
                <p className="text-base">
                    У вас осталось голосов: {data.remainingVotesCount} / {data.votesLimit}
                </p>
                <Progress
                    value={(data.remainingVotesCount / data.votesLimit) * 100}
                    color="primary"
                    className="max-w-md"
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.ideas.map((idea) => (
                    <IdeaCard
                        key={idea.id}
                        idea={idea}
                        handleVote={handleVote}
                        remainingVotesCount={data.remainingVotesCount}
                    />
                ))}
            </div>
        </main>
    );
};

export default Home;
