import React, { useState } from 'react';
import { Card, CardHeader, CardBody, Button, Spinner, Tooltip } from '@heroui/react';
import type { Idea } from '../types';

interface IdeaCardProps {
    idea: Idea;
    handleVote: (id: string) => Promise<void>;
    remainingVotesCount: number;
}

const IdeaCard: React.FC<IdeaCardProps> = ({ idea, handleVote, remainingVotesCount }) => {
    const [isVoting, setIsVoting] = useState(false);

    const handlePress = async () => {
        setIsVoting(true);
        try {
            await handleVote(idea.id);
        } finally {
            setIsVoting(false);
        }
    };

    const buttonText = () => {
        if (isVoting) {
            return <Spinner size="sm" color="white" />;
        }
        if (idea.isVoted) {
            return 'Вы уже проголосовали';
        }
        return 'Проголосовать';
    };

    const isDisabled = idea.isVoted || remainingVotesCount <= 0 || isVoting;

    const tooltipContent = () => {
        if (idea.isVoted) {
            return 'Вы уже отдали свой голос за эту идею.';
        }
        if (remainingVotesCount <= 0) {
            return 'У вас не осталось голосов.';
        }
        return null;
    };

    return (
        <Card className="flex flex-col h-full">
            <CardHeader>
                <p className="font-bold text-lg">{idea.title}</p>
            </CardHeader>
            <CardBody className="flex-grow flex flex-col">
                <p className="text-gray-600 mb-4">{idea.description}</p>
                <div className="flex-grow" />
                <div className="flex items-center justify-between mt-4">
                    <p className="text-gray-600 text-sm">Голосов: {idea.votesCount}</p>
                    <Tooltip content={tooltipContent()} isDisabled={!isDisabled || isVoting}>
                        <div>
                            <Button
                                onPress={handlePress}
                                isDisabled={isDisabled}
                                color="primary"
                                className="w-48"
                            >
                                {buttonText()}
                            </Button>
                        </div>
                    </Tooltip>
                </div>
            </CardBody>
        </Card>
    );
};

export default IdeaCard;
