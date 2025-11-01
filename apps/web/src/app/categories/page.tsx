"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from "react";
import Link from "next/link";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { categoryApi, Category, CreateCategoryData } from "@/lib/api/categories";
import { categorySchema, CategoryForm } from "@/lib/validation/categories";

export default function CategoryPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const queryClient = useQueryClient();

  // Form setup
  const form = useForm<CategoryForm>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "", slug: "", description: "" },
  });

  // Queries and Mutations
  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: categoryApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateCategoryData) => categoryApi.create(data),
    onSuccess: () => {
      toast.success("Category created");
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setIsCreateDialogOpen(false);
      form.reset();
    },
    onError: (err: any) => toast.error("Creation failed", { description: err.message }),
  });

  const updateMutation = useMutation({
    mutationFn: (data: CreateCategoryData) => categoryApi.update(selectedCategory!.id, data),
    onSuccess: () => {
      toast.success("Category updated");
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setIsEditDialogOpen(false);
      setSelectedCategory(null);
    },
    onError: (err: any) => toast.error("Update failed", { description: err.message }),
  });

  const deleteMutation = useMutation({
    mutationFn: () => categoryApi.delete(selectedCategory!.id),
    onSuccess: () => {
      toast.success("Category deleted");
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setIsDeleteDialogOpen(false);
      setSelectedCategory(null);
    },
    onError: (err: any) => toast.error("Deletion failed", { description: err.message }),
  });

  // Handlers
  const onSubmit = (values: CategoryForm) => {
    if (selectedCategory) {
      updateMutation.mutate(values);
    } else {
      createMutation.mutate(values);
    }
  };

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    form.setValue("name", name);
    const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    form.setValue("slug", slug);
  };

  useEffect(() => {
    if (selectedCategory && isEditDialogOpen) {
      form.reset(selectedCategory);
    } else {
      form.reset({ name: "", slug: "", description: "" });
    }
  }, [selectedCategory, isEditDialogOpen, form]);

  const openEditDialog = (category: Category) => {
    setSelectedCategory(category);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  };

  return (
    <main className="container mx-auto max-w-4xl py-12">
      <Button asChild variant="outline" className="mb-8">
        <Link href="/blog">&larr; Back to all posts</Link>
      </Button>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">Manage Categories</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>Create Category</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Category</DialogTitle>
            </DialogHeader>
            <CategoryFormFields form={form} onSubmit={onSubmit} onNameChange={onNameChange} isLoading={createMutation.isPending} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categoriesQuery.isLoading && <TableRow><TableCell colSpan={3} className="text-center">Loading...</TableCell></TableRow>}
            {categoriesQuery.data?.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell className="text-muted-foreground">{category.slug}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditDialog(category)}>
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openDeleteDialog(category)} className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>Make changes to your category here. Click save when you're done.</DialogDescription>
          </DialogHeader>
          <CategoryFormFields form={form} onSubmit={onSubmit} onNameChange={onNameChange} isLoading={updateMutation.isPending} />
        </DialogContent>
      </Dialog>

      {/* Delete Alert Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the category "{selectedCategory?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteMutation.mutate()} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}

// Reusable Form Component
function CategoryFormFields({ form, onSubmit, onNameChange, isLoading }: { form: any, onSubmit: any, onNameChange: any, isLoading: boolean }) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl><Input placeholder="Technology" {...field} onChange={onNameChange} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="slug" render={({ field }) => (
          <FormItem>
            <FormLabel>Slug</FormLabel>
            <FormControl><Input placeholder="technology" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <DialogFooter>
          <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
          <Button type="submit" disabled={isLoading}>{isLoading ? "Saving..." : "Save"}</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}