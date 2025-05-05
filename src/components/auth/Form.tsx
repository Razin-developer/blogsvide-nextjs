import { Eye, EyeOff, Loader2, } from 'lucide-react'
import React from 'react'
import { Form as UIForm, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Input } from '../ui/input'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'


// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Form = ({ handleSubmit, zodSchema, fields, buttonName, loadingState, defaultValues }: { handleSubmit: SubmitHandler<z.infer<typeof zodSchema>>; zodSchema: any, fields: { name: string; placeholder: string; icon: React.ReactNode; type: string; text: string; }[], buttonName: string, loadingState: boolean, defaultValues: object }) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const form = useForm<z.infer<typeof zodSchema>>({
    resolver: zodResolver(zodSchema),
    defaultValues,
  });

  return (
    <div>
      {/* Form */}
      <UIForm {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="space-y-6">
            {fields.map((formField) =>
              <FormField
                key={formField.text}
                control={form.control}
                name={formField.name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{formField.text}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          {formField.icon}
                        </div>
                        <Input
                          {...field}
                          placeholder={formField.placeholder}
                          type={formField.type === "password" ? (showPassword ? "text" : "password") : formField.type}
                          className="pl-10"
                        />
                        {formField.type === "password" && (
                          <div
                            className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff /> : <Eye />}
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
          <button type="submit" className="bg-primary hover:bg-primary-focus h-10 rounded-lg text-white w-full" disabled={loadingState}>
            {loadingState ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading...
              </span>
            ) : (
              <span>{buttonName}</span>
            )}
          </button>
        </form>

      </UIForm>
    </div>
  )
}

export default Form
