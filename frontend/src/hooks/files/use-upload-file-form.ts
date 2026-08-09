import {
    createFileSchema,
    uploadFileFormSchema,
    type UploadFileBody
} from "@/schemas/files/files.schema"
import { createFile } from "@/services/files.services";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast";

export function useUploadFileForm() {

    const form = useForm<UploadFileBody>({
        resolver: zodResolver(uploadFileFormSchema),
        defaultValues: {
            folder_id: "",
            file: undefined,
        }
    });

    async function prepareUpload(body: UploadFileBody) {
        form.clearErrors("root");

        try {

            const payload = {
                folder_id: body.folder_id,
                original_name: body.file.name,
                mime_type: body.file.type,
                size: body.file.size
            };

            const data = createFileSchema.parse(payload);

            const request = await createFile(data);

            if (request.err) {
                form.setError("root", {
                    message: request.err
                });
                return;
            };

            toast.success(request.message);
            form.reset();
            return request;
        } catch (err) {
            const message = err instanceof Error ? err.message : "Error inesperado ao fazer login. Tente novamente.";
            form.setError("root", {
                message: message
            });
            return false;
        };
    };

    return {
        form,
        loading: form.formState.isSubmitting,
        prepareUpload
    }
};