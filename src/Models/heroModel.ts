import mongoose from 'mongoose';

export interface IHero {
    
    name: string;
    image: string;
}

const heroSchema = new mongoose.Schema<IHero>({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
})

export default mongoose.model<IHero>('Hero', heroSchema);