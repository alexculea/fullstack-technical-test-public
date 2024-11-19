"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Form } from "~/components/ui/form"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { api } from "~/trpc/react";
import { FormControl, FormField, FormItem, FormMessage } from "~/components/ui/form";

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Post name must be at least 3 characters.",
  }),
});

export function CreatePost() {
  const router = useRouter();
  const [name, setName] = useState<string>("");
  const utils = api.useUtils();
  const createPost = api.post.create.useMutation({
    onSuccess: async () => {
      router.refresh();
      setName("");

      await utils.post.getLatestPosts.invalidate();
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });


  return (
    <Form {...form}>
      <form
        className="space-y-8"
        onSubmit={
          form.handleSubmit(
            (values: z.infer<typeof formSchema>) => {
              createPost.mutate({ name: values.name })
            }
          )
        }
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field } {...form.register('name') } placeholder="Title" value={name} onChange={
                  (e: React.FormEvent<HTMLInputElement>) => setName(
                    (e.target as HTMLInputElement).value ?? '')
                } />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">{createPost.isPending ? "Submitting..." : "Submit"}</Button>
      </form>
    </Form>
  );
}
