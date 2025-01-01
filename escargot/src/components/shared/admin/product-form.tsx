// "use client";

// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { useToast } from "@/components/ui/use-toast";
// import { yupResolver } from "@hookform/resolvers/yup";
// import { useForm } from "react-hook-form";
// import { Button } from "@/components/ui/button";
// import { UploadButton } from "@/lib/uploadthing";
// import { useRouter } from "next/navigation";
// import * as Yup from "yup";
// import {
//   createProduct,
//   updateProduct,
// } from "@/helpers/PostUpadateDeleteProducts";

// export default function ProductForm({
//   type,
//   product,
//   productId,
// }: {
//   type: "Create" | "Update";
//   product?: {
//     name: string;
//     description: string;
//     price: number;
//     imagePath: string;
//     categoryId: number;
//   };
//   productId?: string;
// }) {
//   const router = useRouter();
//   const { toast } = useToast();

//   // Définition du schéma Yup
//   const productSchema = Yup.object().shape({
//     name: Yup.string()
//       .required("Le nom est obligatoire")
//       .min(3, "Minimum 3 caractères"),
//     description: Yup.string().required("La description est obligatoire"),
//     price: Yup.number()
//       .required("Le prix est obligatoire")
//       .positive("Le prix doit être positif"),
//     imagePath: Yup.string().required("L'image est obligatoire"),
//     categoryId: Yup.number().required("La catégorie est obligatoire"),
//   });

//   // Configuration de React Hook Form avec Yup
//   const form = useForm({
//     resolver: yupResolver(productSchema),
//     defaultValues: product || {
//       name: "",
//       description: "",
//       price: 0,
//       imagePath: "",
//       categoryId: 0,
//     },
//   });

//   // Gestion de la soumission
//   async function onSubmit(values: any) {
//     if (type === "Create") {
//       const res = await createProduct(values);
//       if (!res.success) {
//         toast({
//           variant: "destructive",
//           description: res.message,
//         });
//       } else {
//         toast({ description: res.message });
//         router.push("/admin/products");
//       }
//     } else if (type === "Update") {
//       if (!productId) return;
//       const res = await updateProduct(Number(productId), values);;
//       if (!res.success) {
//         toast({
//           variant: "destructive",
//           description: res.message,
//         });
//       } else {
//         toast({ description: res.message });
//         router.push("/admin/products");
//       }
//     }
//   }

//   type UploadResponse = { url: string }[];

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//         <FormField
//           control={form.control}
//           name="name"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Nom</FormLabel>
//               <FormControl>
//                 <Input placeholder="Nom du produit" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <FormField
//           control={form.control}
//           name="description"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Description</FormLabel>
//               <FormControl>
//                 <Input placeholder="Description du produit" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <FormField
//           control={form.control}
//           name="price"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Prix</FormLabel>
//               <FormControl>
//                 <Input type="number" placeholder="Prix" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <FormField
//           control={form.control}
//           name="categoryId"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Catégorie</FormLabel>
//               <FormControl>
//                 <Input
//                   type="number"
//                   placeholder="ID de la catégorie"
//                   {...field}
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <FormField
//           control={form.control}
//           name="imagePath"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Image</FormLabel>
//               <FormControl>
//   <UploadButton
//     endpoint="imageUploader"
//     onClientUploadComplete={(res: UploadResponse) => {
//       form.setValue("imagePath", res[0]?.url || ""); // Met à jour l'imagePath avec la première URL
//     }}
//     onUploadError={(error: Error) => {
//       toast({
//         variant: "destructive",
//         description: `Erreur: ${error.message}`,
//       });
//     }}
//   />
// </FormControl>

//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <Button
//           type="submit"
//           size="lg"
//           disabled={form.formState.isSubmitting}
//           className="w-full"
//         >
//           {form.formState.isSubmitting ? "En cours..." : `${type} Produit`}
//         </Button>
//       </form>
//     </Form>
//   );
// }
