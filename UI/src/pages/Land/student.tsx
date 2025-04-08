
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CheckCircle2, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { CircularProgress } from "./circular-progress"
// import config from "@/config"
import { toast } from "sonner"

const formSchema = z.object({
  gender: z.string({
    required_error: "Please select your gender",
  }),
  studyHoursPerWeek: z.number().min(0, "Hours must be at least 0").max(40, "Hours must be less than 40"),
  attendanceRate: z
    .number()
    .min(0, "Attendance rate must be at least 0")
    .max(100, "Attendance rate must be at most 100"),
  pastExamScores: z.number().min(0, "Score must be at least 0").max(100, "Score must be at most 100"),
  parentalEducationLevel: z.string({
    required_error: "Please select parental education level",
  }),
  internetAccessAtHome: z.string({
    required_error: "Please indicate if you have internet access at home",
  }),
  extracurricularActivities: z.boolean().default(false),
})

type PredictionResult = {
  message: string
  score: number
}

export default function StudentForm() {
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studyHoursPerWeek: 10,
      attendanceRate: 75,
      pastExamScores: 70,
      extracurricularActivities: false,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
    let data  = {
      "Gender": values.gender === "1" ? 1 : 0,
      "Study_Hours_per_Week": values.studyHoursPerWeek,
      "Attendance_Rate": values.attendanceRate,
      "Past_Exam_Scores": values.pastExamScores,
      "Parental_Education_Level": values.parentalEducationLevel === "primary" ? 1 : values.parentalEducationLevel === "secondary" ? 2 : values.parentalEducationLevel === "higher" ? 3 : 4,
      "Internet_Access_at_Home": values.internetAccessAtHome === "yes" ? 1 : 0,
      "Extracurricular_Activities": values.extracurricularActivities ? 1 : 0
    }
    // perfome post request
    const response = await fetch(`http://localhost:5000/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    
    let predictionResult: PredictionResult = {
      score: result.prediction.toFixed(2),
      message: result.prediction.toFixed(2) > 60 ? "PASS": "FAIL",
    }
    setResult(predictionResult);
    } catch (error) {
      console.error("Error submitting form:", error)
      toast.error("An error occurred while processing your information.")
      // setResult({
      //   message: "An error occurred while processing your information.",
      //   score: 0,
      // })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Helper function to get status text based on score
  const getStatusText = (score: number) => {
    if (score >= 70) return "High Chance of Success"
    if (score >= 50) return "Moderate Chance of Success"
    return "Low Chance of Success"
  }

  // Helper function to get status color based on score
  const getStatusColor = (score: number) => {
    if (score >= 70) return "text-green-600"
    if (score >= 50) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <Card className="w-full max-w-2xl mx-auto border-blue-200 shadow-lg">
      <CardHeader className="bg-blue-50 border-b border-blue-100">
        <CardTitle className="text-blue-700">Student Information</CardTitle>
        <CardDescription>Fill out this form to predict your exam performance.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="border-blue-200 focus:ring-blue-500">
                        <SelectValue placeholder="Select your gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="0">Male</SelectItem>
                      <SelectItem value="1">Female</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="studyHoursPerWeek"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Study Hours per Week</FormLabel>
                  <FormControl>
                    <div className="space-y-3">
                      <Slider
                        min={0}
                        max={40}
                        step={1}
                        value={[field.value]}
                        onValueChange={(value: any) => field.onChange(value[0])}
                        className="[&_.slider-thumb]:bg-blue-600 [&_.slider-range]:bg-blue-500"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>0 hours</span>
                        <span className="font-medium text-blue-600">{field.value} hours</span>
                        <span>40 hours</span>
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>Average number of hours you study per week</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="attendanceRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Attendance Rate (%)</FormLabel>
                  <FormControl>
                    <div className="space-y-3">
                      <Slider
                        min={0}
                        max={100}
                        step={1}
                        value={[field.value]}
                        onValueChange={(value: any) => field.onChange(value[0])}
                        className="[&_.slider-thumb]:bg-blue-600 [&_.slider-range]:bg-blue-500"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>0%</span>
                        <span className="font-medium text-blue-600">{field.value}%</span>
                        <span>100%</span>
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>Your class attendance percentage</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pastExamScores"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Past Exam Scores</FormLabel>
                  <FormControl>
                    <div className="space-y-3">
                      <Slider
                        min={0}
                        max={100}
                        step={1}
                        value={[field.value]}
                        onValueChange={(value: any) => field.onChange(value[0])}
                        className="[&_.slider-thumb]:bg-blue-600 [&_.slider-range]:bg-blue-500"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>0</span>
                        <span className="font-medium text-blue-600">{field.value}</span>
                        <span>100</span>
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>Average score from your previous exams (0-100)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="parentalEducationLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parental Education Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="border-blue-200 focus:ring-blue-500">
                        <SelectValue placeholder="Select education level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="primary">Primary Education</SelectItem>
                      <SelectItem value="secondary">Secondary Education</SelectItem>
                      <SelectItem value="higher">Higher Education</SelectItem>
                      <SelectItem value="postgraduate">Postgraduate</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="internetAccessAtHome"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Internet Access at Home</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="yes" className="border-blue-400 text-blue-600" />
                        </FormControl>
                        <FormLabel className="font-normal">Yes</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="no" className="border-blue-400 text-blue-600" />
                        </FormControl>
                        <FormLabel className="font-normal">No</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="extracurricularActivities"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="border-blue-400 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Extracurricular Activities</FormLabel>
                    <FormDescription>Do you participate in any extracurricular activities?</FormDescription>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      {result && (
        <CardFooter className="flex flex-col items-center border-t border-blue-100 pt-6 pb-8 bg-blue-50">
          <div className="flex items-center mb-4">
            <CheckCircle2 className="h-5 w-5 text-blue-600 mr-2" />
            <span className="font-medium text-blue-700">Prediction Complete</span>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8 w-full">
            <CircularProgress percentage={result.score} />

            <div className="text-center md:text-left md:flex-1">
              <h3 className={`text-lg font-semibold mb-2 ${getStatusColor(result.score)}`}>
                {getStatusText(result.score)}
              </h3>
              <p className="text-gray-700">{result.message}</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4 text-center text-xs w-full max-w-xs">
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 mb-1"></div>
              <span>Low Chance</span>
              <span className="text-gray-500">0-49%</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-yellow-500 mb-1"></div>
              <span>Moderate</span>
              <span className="text-gray-500">50-69%</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mb-1"></div>
              <span>High Chance</span>
              <span className="text-gray-500">70-100%</span>
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  )
}
