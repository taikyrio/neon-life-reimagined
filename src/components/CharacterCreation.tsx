import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Character } from '../types/Character';

interface CharacterCreationProps {
  onCharacterCreate: (character: Character) => void;
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  gender: z.enum(['male', 'female']),
})

const CharacterCreation: React.FC<CharacterCreationProps> = ({ onCharacterCreate }) => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      gender: "male",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const birthYear = new Date().getFullYear() - 18; // Assume starting age is 18

    const newCharacter: Character = {
      id: Math.random().toString(36).substr(2, 9),
      name: name,
      age: 18,
      gender: gender,
      birthYear: birthYear,
      health: Math.floor(Math.random() * 31) + 70, // 70-100
      happiness: Math.floor(Math.random() * 31) + 70, // 70-100
      smartness: Math.floor(Math.random() * 51) + 50, // 50-100
      appearance: Math.floor(Math.random() * 51) + 50, // 50-100
      fitness: Math.floor(Math.random() * 51) + 50,   // 50-100
      money: 500,
      education: 'High School Diploma',
      job: 'Unemployed',
      salary: 0,
      housing: 'Living with Parents', // Default housing
      careerLevel: 0, // Default career level
      family: [
        { id: 'f1', name: `John ${name.split(' ').pop()}`, relationship: 'father', age: 45, alive: true, relationshipLevel: 70 },
        { id: 'm1', name: `Jane ${name.split(' ').pop()}`, relationship: 'mother', age: 43, alive: true, relationshipLevel: 75 },
      ],
      relationships: [],
      lifeEvents: [{
        id: Math.random().toString(36).substr(2,9),
        year: birthYear + 18,
        age: 18,
        event: 'Started life!',
        type: 'neutral'
      }],
      achievements: [],
      criminalRecord: [],
      assets: [],
      pendingEvents: [], // Initialize pendingEvents
      // monthlyExpenses is calculated dynamically, so not set here
    };
    onCharacterCreate(newCharacter);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md">
        <h2 className="text-2xl text-center mb-4">Create Your Character</h2>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your character's name" {...field} value={name} onChange={(e) => setName(e.target.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-md border p-4">
                  <div>
                    <FormLabel>Gender</FormLabel>
                  </div>
                  <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-2">
                    <FormItem>
                      <RadioGroupItem value="male" id="r1"  onClick={() => setGender('male')}/>
                      <FormLabel htmlFor="r1">Male</FormLabel>
                    </FormItem>
                    <FormItem>
                      <RadioGroupItem value="female" id="r2" onClick={() => setGender('female')}/>
                      <FormLabel htmlFor="r2">Female</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Create Character</Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CharacterCreation;
